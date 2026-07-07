const functions = require("firebase-functions");
const admin = require("firebase-admin");
const { Translate } = require("@google-cloud/translate").v2;
const OpenAI = require("openai");

// ========================
// 🔐 SAFE INIT
// ========================
if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

// ========================
// 🤖 OPENAI SAFE INIT
// ========================
const openai = new OpenAI({
  apiKey:
    process.env.OPENAI_API_KEY ||
    functions.config()?.openai?.key
});

// ========================
// 🌍 TRANSLATE
// ========================
const translate = new Translate();

const LANGS = ["fr","en","ar","sw","ha","yo","am","zu","ig","ff"];

// ========================
// 🚨 RATE LIMIT (ROBUST)
// ========================
async function checkRateLimit(type, id) {
  const ref = db.collection("rate_limits").doc(`${type}_${id}`);
  const snap = await ref.get();

  const now = Date.now();
  const LIMIT = 10;
  const WINDOW = 60 * 1000;

  const data = snap.exists ? snap.data() : { count: 0, last: now };

  if (now - data.last > WINDOW) {
    await ref.set({ count: 1, last: now });
    return;
  }

  if (data.count >= LIMIT) {
    throw new functions.https.HttpsError(
      "resource-exhausted",
      "Rate limit exceeded"
    );
  }

  await ref.update({
    count: admin.firestore.FieldValue.increment(1)
  });
}

// ========================
// 🧠 SAFE FALLBACK
// ========================
function fallbackCourse(query) {
  return {
    description: `Cours sur ${query}`,
    content: `Contenu structuré sur ${query}`,
    steps: [
      { title: "Introduction", content: "...", order: 1 }
    ],
    tags: [query.toLowerCase()]
  };
}

// ========================
// 🤖 AI ENGINE SAFE
// ========================
async function generateCourseContent(query, language) {
  try {
    const prompt = `
Crée un cours structuré sur "${query}" en ${language}.
Retourne UNIQUEMENT un JSON valide avec :
description, content, steps, tags
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un expert pédagogique mondial."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 900
    });

    const text = completion.choices?.[0]?.message?.content || "";

    try {
      return JSON.parse(text);
    } catch (e) {
      console.warn("⚠️ JSON invalid fallback used");
      return fallbackCourse(query);
    }

  } catch (error) {
    console.error("AI ERROR:", error);
    return fallbackCourse(query);
  }
}

// ========================
// 📘 CREATE COURSE AUTO
// ========================
exports.createMissingCourse = functions.firestore
  .document("course_searches/{id}")
  .onCreate(async (snap) => {

    const data = snap.data();
    const query = data?.query?.trim();

    if (!query) return null;

    // 🔐 rate limit
    await checkRateLimit("course", snap.id);

    // ⚡ cache
    const cacheRef = db.collection("ai_cache").doc(query.toLowerCase());
    const cache = await cacheRef.get();

    if (cache.exists) {
      return null;
    }

    // 🤖 generate
    const course = await generateCourseContent(query, "fr");

    // 🧱 write course
    const ref = db.collection("courses").doc();

    await ref.set({
      id: ref.id,
      title: query,
      description: course.description || "",
      content: course.content || "",
      steps: course.steps || [],
      tags: course.tags || [],
      isPublished: true,
      authorId: "system",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    // 💾 cache save
    await cacheRef.set(course);

    console.log("✅ Course created:", ref.id);

    return null;
  });

// ========================
// 🌍 TRANSLATION FIXED
// ========================
exports.translateCourse = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  const { courseId, targetLanguage } = data;

  if (!courseId || !targetLanguage) {
    throw new functions.https.HttpsError("invalid-argument");
  }

  const doc = await db.collection("courses").doc(courseId).get();

  if (!doc.exists) {
    throw new functions.https.HttpsError("not-found");
  }

  const course = doc.data();

  const [translation] = await translate.translate(
    course.content || "",
    targetLanguage
  );

  await db.collection("courses")
    .doc(courseId)
    .collection("translations")
    .doc(targetLanguage)
    .set({
      text: translation,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  return { success: true, translation };
});

// ========================
// 💬 CHATBOT PRODUCTION SAFE
// ========================
exports.generateChatbotReply = functions.https.onCall(async (data, context) => {

  if (!context.auth) {
    throw new functions.https.HttpsError("unauthenticated");
  }

  const userMessage = data?.userMessage;

  if (!userMessage || userMessage.length > 1500) {
    throw new functions.https.HttpsError("invalid-argument");
  }

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Tu es un assistant éducatif intelligent UniMentorAI."
        },
        {
          role: "user",
          content: userMessage
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    return response.choices?.[0]?.message?.content || "";

  } catch (err) {
    console.error("CHAT ERROR:", err);

    throw new functions.https.HttpsError(
      "internal",
      "AI generation failed"
    );
  }
});
// AI ROUTE READY (add express route if needed)

