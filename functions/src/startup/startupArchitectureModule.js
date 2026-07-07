const functions = require('firebase-functions');
const admin = require('firebase-admin');
const crypto = require('crypto');
const { getSecret } = require('../security/secretManager');
const dedup = require('./courseDeduplicationEngine');
const rateLimiter = require('../middleware/rateLimiter');

const SIGNATURE_COURSES = [
  'Apprendre a apprendre efficacement',
  "Maitriser l'intelligence artificielle",
  'Productivite extreme pour etudiants',
  'Programmation moderne (Python + IA)',
  'Entrepreneuriat digital',
  'Finance personnelle et investissement',
  'Communication et prise de parole',
  'Leadership et influence',
  'Pensee critique et resolution de problemes',
  'Construire une carriere internationale',
];

const AI_MENTORS = [
  { id: 'ai_mentor_math', domain: 'math' },
  { id: 'ai_mentor_programming', domain: 'programming' },
  { id: 'ai_mentor_ai', domain: 'ai' },
  { id: 'ai_mentor_productivity', domain: 'productivity' },
  { id: 'ai_mentor_business', domain: 'business' },
  { id: 'ai_mentor_career', domain: 'career' },
  { id: 'ai_mentor_finance', domain: 'finance' },
  { id: 'ai_mentor_research', domain: 'research' },
  { id: 'ai_mentor_language', domain: 'language' },
];

function assertAuthenticated(context) {
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'Authentification requise.');
  }
}

function assertAdminOrMentor(context) {
  assertAuthenticated(context);
  const role = context.auth.token.role;
  if (role !== 'admin' && role !== 'enterprise_admin' && role !== 'mentor') {
    throw new functions.https.HttpsError('permission-denied', 'Role insuffisant.');
  }
}

function getCourseFromDoc(doc) {
  const data = doc.data() || {};
  const steps = Array.isArray(data.steps) ? data.steps : [];
  const rawModules = Array.isArray(data.modules) ? data.modules : steps;
  const modules = (rawModules || []).map((item, index) => ({
    title: item.title || item.nom || item.name || `module_${index + 1}`,
    order: item.order ?? index + 1,
  }));
  const title =
    typeof data.title === 'object' && data.title !== null
      ? data.title.fr || data.title.en || JSON.stringify(data.title)
      : data.title || '';
  const description =
    typeof data.description === 'object' && data.description !== null
      ? data.description.fr || data.description.en || JSON.stringify(data.description)
      : data.description || '';
  const content =
    typeof data.content === 'object' && data.content !== null
      ? data.content.fr || data.content.en || JSON.stringify(data.content)
      : data.content || description;
  return {
    id: doc.id,
    title,
    content,
    modules,
    description,
    isPublished: data.isPublished === true,
    metadata: data.metadata || {},
  };
}

async function listCourses() {
  const snapshot = await admin.firestore().collection('courses').limit(500).get();
  return snapshot.docs.map(getCourseFromDoc);
}

function buildAuditReport(courses) {
  const duplicates = [];
  const titleSeen = new Map();
  const normalizedTitles = new Set();

  for (const course of courses) {
    const normalized = dedup.normalizeText(course.title);
    normalizedTitles.add(normalized);

    if (!titleSeen.has(normalized)) {
      titleSeen.set(normalized, [course]);
    } else {
      titleSeen.get(normalized).push(course);
    }
  }

  for (const sameTitleCourses of titleSeen.values()) {
    if (sameTitleCourses.length <= 1) continue;
    for (let i = 0; i < sameTitleCourses.length; i += 1) {
      for (let j = i + 1; j < sameTitleCourses.length; j += 1) {
        const left = sameTitleCourses[i];
        const right = sameTitleCourses[j];
        duplicates.push({
          leftCourseId: left.id,
          rightCourseId: right.id,
          risk: 'high_title_match',
        });
      }
    }
  }

  const missingCourses = SIGNATURE_COURSES.filter((title) => {
    const target = dedup.normalizeText(title);
    let best = 0;
    for (const existing of normalizedTitles) {
      best = Math.max(best, dedup.jaccard(target, existing));
    }
    return best < 0.6;
  });

  const coursesToImprove = courses
    .filter((course) => {
      const moduleCount = course.modules.length;
      const hasProject = /projet/i.test(course.content);
      const hasQuiz = /quiz/i.test(course.content);
      return moduleCount < 8 || !hasProject || !hasQuiz;
    })
    .slice(0, 100)
    .map((course) => ({
      courseId: course.id,
      title: course.title,
      reason: 'structure_not_complete',
      moduleCount: course.modules.length,
    }));

  return {
    generatedAt: new Date().toISOString(),
    existing_courses: courses.length,
    existing_modules: courses.reduce((sum, c) => sum + c.modules.length, 0),
    existing_lessons: courses.reduce((sum, c) => sum + c.modules.length, 0),
    existing_events: null,
    existing_certificates: null,
    audit_report: {
      totalCourses: courses.length,
      missingCoursesCount: missingCourses.length,
      coursesToImproveCount: coursesToImprove.length,
      duplicateRiskCount: duplicates.length,
    },
    missing_courses: missingCourses,
    courses_to_improve: coursesToImprove,
    duplicate_risk: duplicates,
  };
}

async function enrichCourseWithoutOverwrite(courseId, enrichmentPatch) {
  const ref = admin.firestore().collection('courses').doc(courseId);
  const doc = await ref.get();
  if (!doc.exists) return { updated: false, reason: 'course_not_found' };
  await ref.set(
    {
      ...enrichmentPatch,
      metadata: {
        ...(doc.data().metadata || {}),
        ...((enrichmentPatch && enrichmentPatch.metadata) || {}),
        enrichedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
  return { updated: true };
}

exports.runStartupAudit = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const courses = await listCourses();
  const report = buildAuditReport(courses);

  const reportId = `startup_audit_${Date.now()}`;
  await admin.firestore().collection('audit_report').doc(reportId).set(report, { merge: true });
  await admin.firestore().collection('audit_report').doc('latest').set(report, { merge: true });
  return { success: true, reportId, ...report.audit_report };
});

exports.courseDeduplicationEngine = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const candidate = data?.candidateCourse;
  if (!candidate || !candidate.title) {
    throw new functions.https.HttpsError('invalid-argument', 'candidateCourse.title requis.');
  }

  const courses = await listCourses();
  let topRisk = null;
  for (const existing of courses) {
    const risk = dedup.detectDuplicateRisk(existing, candidate);
    if (!topRisk || risk.weightedScore > topRisk.weightedScore) {
      topRisk = { courseId: existing.id, title: existing.title, ...risk };
    }
  }

  return {
    success: true,
    decision: topRisk?.isDuplicateRisk ? 'enrich_existing' : 'safe_to_create',
    topRisk,
  };
});

exports.seedSignatureCourses = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const courses = await listCourses();
  const results = [];

  for (const title of SIGNATURE_COURSES) {
    const candidate = {
      title,
      modules: Array.from({ length: 10 }).map((_, index) => ({ title: `Module ${index + 1}` })),
      content: 'Introduction Objectifs Modules Lecons Exemples Exercices Quiz Projet Resume Ressources',
    };

    let best = null;
    for (const existing of courses) {
      const score = dedup.detectDuplicateRisk(existing, candidate);
      if (!best || score.weightedScore > best.weightedScore) {
        best = { existing, score };
      }
    }

    if (best && best.score.weightedScore >= 0.6) {
      await enrichCourseWithoutOverwrite(best.existing.id, {
        learningTemplateVersion: 'startup_yc_v1',
        standardStructure: {
          introduction: true,
          objectives: true,
          modules: true,
          lessons: true,
          examples: true,
          exercises: true,
          quiz: true,
          project: true,
          summary: true,
          resources: true,
        },
        metadata: {
          signatureTrack: true,
          signatureCourseLabel: title,
        },
      });
      results.push({ title, action: 'enriched_existing', courseId: best.existing.id });
    } else {
      const created = await admin.firestore().collection('courses').add({
        title,
        description: `Formation signature UniMentorAI: ${title}`,
        content:
          '1 Introduction 2 Objectifs pedagogiques 3 Modules structures 4 Lecons detaillees 5 Exemples concrets 6 Exercices 7 Quiz 8 Projet pratique 9 Resume 10 Ressources supplementaires',
        language: 'fr',
        isPublished: true,
        difficulty: 'beginner',
        duration: 120,
        steps: Array.from({ length: 10 }).map((_, index) => ({
          title: `Module ${index + 1}`,
          content: `Contenu du module ${index + 1}`,
          order: index + 1,
        })),
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        metadata: {
          signatureTrack: true,
          createdBy: 'seedSignatureCourses',
          learningTemplateVersion: 'startup_yc_v1',
        },
      });
      results.push({ title, action: 'created_new', courseId: created.id });
    }
  }

  return { success: true, results };
});

exports.upsertDefaultAIMentors = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const batch = admin.firestore().batch();
  const now = admin.firestore.FieldValue.serverTimestamp();

  for (const mentor of AI_MENTORS) {
    const ref = admin.firestore().collection('ai_mentors').doc(mentor.id);
    batch.set(
      ref,
      {
        mentor_id: mentor.id,
        domain: mentor.domain,
        capabilities: ['explain', 'correct_exercises', 'recommend_courses', 'track_progress'],
        active: true,
        updatedAt: now,
      },
      { merge: true }
    );
  }
  await batch.commit();
  return { success: true, count: AI_MENTORS.length };
});

exports.createLiveEvent = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const required = ['title', 'course_id', 'mentor_id', 'event_type', 'date', 'duration', 'capacity'];
  for (const key of required) {
    if (!data || data[key] === undefined || data[key] === null || data[key] === '') {
      throw new functions.https.HttpsError('invalid-argument', `Champ requis: ${key}`);
    }
  }
  if (!['webinar', 'live_class'].includes(data.event_type)) {
    throw new functions.https.HttpsError('invalid-argument', 'event_type invalide');
  }

  const eventRef = admin.firestore().collection('events').doc();
  await eventRef.set(
    {
      event_id: eventRef.id,
      title: data.title,
      course_id: data.course_id,
      mentor_id: data.mentor_id,
      event_type: data.event_type,
      date: admin.firestore.Timestamp.fromDate(new Date(data.date)),
      duration: Number(data.duration),
      meeting_link: data.meeting_link || null,
      recording_link: data.recording_link || null,
      capacity: Number(data.capacity),
      participants_count: 0,
      participants: [],
      reminder_sent_24h: false,
      reminder_sent_1h: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: context.auth.uid,
    },
    { merge: true }
  );
  return { success: true, eventId: eventRef.id };
});

exports.registerToLiveEvent = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const eventId = data?.event_id;
  if (!eventId) {
    throw new functions.https.HttpsError('invalid-argument', 'event_id requis');
  }

  const userId = context.auth.uid;
  const eventRef = admin.firestore().collection('events').doc(eventId);
  await admin.firestore().runTransaction(async (tx) => {
    const eventDoc = await tx.get(eventRef);
    if (!eventDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'Evenement introuvable.');
    }
    const eventData = eventDoc.data();
    const currentCount = Number(eventData.participants_count || 0);
    const capacity = Number(eventData.capacity || 0);
    const participants = Array.isArray(eventData.participants) ? eventData.participants : [];
    if (participants.includes(userId)) return;
    if (capacity > 0 && currentCount >= capacity) {
      throw new functions.https.HttpsError('failed-precondition', 'Capacite maximale atteinte.');
    }
    tx.update(eventRef, {
      participants_count: currentCount + 1,
      participants: admin.firestore.FieldValue.arrayUnion(userId),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    const registrationRef = eventRef.collection('registrations').doc(userId);
    tx.set(
      registrationRef,
      {
        user_id: userId,
        registeredAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  return { success: true, event_id: eventId };
});

exports.sendLiveEventReminders = functions.pubsub
  .schedule('every 15 minutes')
  .timeZone('UTC')
  .onRun(async () => {
    const now = Date.now();
    const oneHourLater = now + 60 * 60 * 1000;
    const twentyFourHoursLater = now + 24 * 60 * 60 * 1000;
    const eventsSnap = await admin
      .firestore()
      .collection('events')
      .where('date', '>=', admin.firestore.Timestamp.fromMillis(now))
      .where('date', '<=', admin.firestore.Timestamp.fromMillis(twentyFourHoursLater))
      .limit(100)
      .get();

    const writes = [];
    for (const doc of eventsSnap.docs) {
      const event = doc.data();
      const startAt = event.date?.toMillis?.() || 0;
      const participants = Array.isArray(event.participants) ? event.participants : [];
      const shouldSend24h = startAt > oneHourLater && !event.reminder_sent_24h;
      const shouldSend1h = startAt <= oneHourLater && !event.reminder_sent_1h;
      if (!shouldSend24h && !shouldSend1h) continue;

      for (const userId of participants.slice(0, 500)) {
        writes.push(
          admin
            .firestore()
            .collection('users')
            .doc(userId)
            .collection('notifications')
            .add({
              type: 'event_reminder',
              event_id: doc.id,
              title: event.title,
              message: shouldSend24h
                ? 'Votre evenement commence dans moins de 24h.'
                : 'Votre evenement commence dans moins d une heure.',
              createdAt: admin.firestore.FieldValue.serverTimestamp(),
              read: false,
            })
        );
      }

      writes.push(
        doc.ref.set(
          {
            reminder_sent_24h: shouldSend24h ? true : event.reminder_sent_24h === true,
            reminder_sent_1h: shouldSend1h ? true : event.reminder_sent_1h === true,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        )
      );
    }

    await Promise.all(writes);
    return null;
  });

async function getCertificateSecret() {
  return getSecret('CERTIFICATES_SECRET');
}

async function buildCertificateToken(certificateId, userId, courseId) {
  const payload = `${certificateId}:${userId}:${courseId}`;
  const secret = await getCertificateSecret();
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

exports.issueSecureCertificate = functions.https.onCall(async (data, context) => {
  assertAdminOrMentor(context);
  const required = ['user_id', 'course_id', 'completion_score'];
  for (const key of required) {
    if (!data || data[key] === undefined || data[key] === null || data[key] === '') {
      throw new functions.https.HttpsError('invalid-argument', `Champ requis: ${key}`);
    }
  }

  const certificateRef = admin.firestore().collection('certificates').doc();
  const token = await buildCertificateToken(certificateRef.id, data.user_id, data.course_id);
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  const verificationUrl = `${data.base_verification_url || 'https://unimentorai.com/verify-certificate'}?certificate_id=${certificateRef.id}&token=${token}`;

  await certificateRef.set(
    {
      certificate_id: certificateRef.id,
      user_id: data.user_id,
      course_id: data.course_id,
      issue_date: admin.firestore.FieldValue.serverTimestamp(),
      verification_url: verificationUrl,
      qr_code: verificationUrl,
      completion_score: Number(data.completion_score),
      token_hash: tokenHash,
      status: 'issued',
      createdBy: context.auth.uid,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  return {
    success: true,
    certificate_id: certificateRef.id,
    verification_url: verificationUrl,
    qr_code: verificationUrl,
  };
});

async function certificateVerificationHandler(req, res) {
  try {
    const certificateId = req.query.certificate_id;
    const token = req.query.token;

    // Validation strict format (anti-abus + anti-erreurs DB)
    if (!certificateId || !token) {
      res.status(400).json({ valid: false, message: 'certificate_id et token requis' });
      return;
    }

    const certificateIdStr = String(certificateId);
    const tokenStr = String(token);
    if (certificateIdStr.length < 8 || certificateIdStr.length > 128 || tokenStr.length < 16 || tokenStr.length > 256) {
      res.status(400).json({ valid: false, message: 'Format invalid' });
      return;
    }

    const certDoc = await admin.firestore().collection('certificates').doc(certificateIdStr).get();
    if (!certDoc.exists) {
      res.status(404).json({ valid: false, message: 'Certificat introuvable' });
      return;
    }

    const cert = certDoc.data();
    const providedTokenHash = crypto.createHash('sha256').update(tokenStr).digest('hex');
    const isAuthentic = providedTokenHash === cert.token_hash;

    if (!isAuthentic) {
      res.status(403).json({ valid: false, message: 'Certificat non authentique' });
      return;
    }

    const [userDoc, courseDoc] = await Promise.all([
      admin.firestore().collection('users').doc(cert.user_id).get(),
      admin.firestore().collection('courses').doc(cert.course_id).get(),
    ]);

    res.status(200).json({
      valid: true,
      certificate_id: certificateIdStr,
      nom_etudiant: userDoc.exists ? userDoc.data().name || userDoc.data().displayName || 'Etudiant' : 'Etudiant',
      cours: courseDoc.exists ? courseDoc.data().title || cert.course_id : cert.course_id,
      score: cert.completion_score,
      date: cert.issue_date || null,
      authenticite: 'verifie',
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
}

exports.certificateVerificationPage = functions.https.onRequest(rateLimiter.withRateLimitHttp(certificateVerificationHandler));

exports.logLearningActivity = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const userId = context.auth.uid;
  const studyMinutes = Number(data?.study_minutes || 0);
  const courseId = (data?.course_id || '').toString();
  const completedLesson = data?.completed_lesson === true;
  const now = new Date();
  const dayKey = now.toISOString().slice(0, 10);

  const userRef = admin.firestore().collection('users').doc(userId);
  const progressRef = admin.firestore().collection('progress').doc(`${userId}_${dayKey}`);
  const analyticsRef = admin.firestore().collection('analytics').doc();

  await admin.firestore().runTransaction(async (tx) => {
    const userDoc = await tx.get(userRef);
    const user = userDoc.exists ? userDoc.data() : {};
    const streak = user?.streak || { current: 0, last_day: null, best: 0 };
    const lastDay = streak.last_day;

    let nextCurrent = Number(streak.current || 0);
    if (lastDay !== dayKey) {
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      const yesterdayKey = yesterday.toISOString().slice(0, 10);
      nextCurrent = lastDay === yesterdayKey ? nextCurrent + 1 : 1;
    }
    const nextBest = Math.max(nextCurrent, Number(streak.best || 0));

    tx.set(
      userRef,
      {
        streak: {
          current: nextCurrent,
          best: nextBest,
          last_day: dayKey,
        },
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    tx.set(
      progressRef,
      {
        user_id: userId,
        day: dayKey,
        study_time: admin.firestore.FieldValue.increment(studyMinutes),
        course_id: courseId || null,
        completed_lessons: admin.firestore.FieldValue.increment(completedLesson ? 1 : 0),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    tx.set(analyticsRef, {
      metric: 'study_time',
      user_id: userId,
      course_id: courseId || null,
      value: studyMinutes,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      source: 'logLearningActivity',
    });
  });

  return { success: true };
});

exports.createReferralCode = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const userId = context.auth.uid;
  const code = (data?.code || `${userId.slice(0, 6)}${Date.now().toString().slice(-4)}`).toUpperCase();
  const ref = admin.firestore().collection('referrals').doc(code);
  const existing = await ref.get();
  if (existing.exists && existing.data()?.referrer_id !== userId) {
    throw new functions.https.HttpsError('already-exists', 'Code deja utilise.');
  }
  await ref.set(
    {
      code,
      referrer_id: userId,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      uses_count: existing.exists ? existing.data().uses_count || 0 : 0,
      active: true,
    },
    { merge: true }
  );
  return { success: true, code };
});

exports.applyReferralCode = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const userId = context.auth.uid;
  const code = (data?.code || '').toString().toUpperCase();
  if (!code) {
    throw new functions.https.HttpsError('invalid-argument', 'Code requis');
  }
  const ref = admin.firestore().collection('referrals').doc(code);
  await admin.firestore().runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new functions.https.HttpsError('not-found', 'Code introuvable');
    const doc = snap.data();
    if (!doc.active) throw new functions.https.HttpsError('failed-precondition', 'Code inactif');
    if (doc.referrer_id === userId) throw new functions.https.HttpsError('failed-precondition', 'Auto-parrainage interdit');

    const usageRef = ref.collection('uses').doc(userId);
    const usageDoc = await tx.get(usageRef);
    if (usageDoc.exists) return;

    tx.set(usageRef, {
      user_id: userId,
      appliedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.update(ref, {
      uses_count: admin.firestore.FieldValue.increment(1),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.set(
      admin.firestore().collection('achievements').doc(`${userId}_referral_joined`),
      {
        user_id: userId,
        type: 'referral_joined',
        code,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });
  return { success: true };
});

exports.joinWeeklyChallenge = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const userId = context.auth.uid;
  const challengeId = (data?.challenge_id || '').toString();
  if (!challengeId) throw new functions.https.HttpsError('invalid-argument', 'challenge_id requis');

  const challengeRef = admin.firestore().collection('weekly_challenges').doc(challengeId);
  const participantRef = challengeRef.collection('participants').doc(userId);
  await participantRef.set(
    {
      user_id: userId,
      joinedAt: admin.firestore.FieldValue.serverTimestamp(),
      progress: 0,
      completed: false,
    },
    { merge: true }
  );
  return { success: true };
});

exports.getLeaderboard = functions.https.onCall(async (data, context) => {
  assertAuthenticated(context);
  const limit = Math.min(Number(data?.limit || 50), 100);
  const snap = await admin
    .firestore()
    .collection('users')
    .orderBy('streak.current', 'desc')
    .limit(limit)
    .get();
  const leaderboard = snap.docs.map((doc, index) => {
    const user = doc.data();
    return {
      rank: index + 1,
      user_id: doc.id,
      display_name: user.name || user.displayName || 'Etudiant',
      streak: user?.streak?.current || 0,
      best_streak: user?.streak?.best || 0,
    };
  });
  return { success: true, leaderboard };
});

