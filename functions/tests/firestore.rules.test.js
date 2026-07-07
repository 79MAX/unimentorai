"use strict";

const fs = require("fs");
const path = require("path");
const {initializeTestEnvironment, assertFails, assertSucceeds} = require("@firebase/rules-unit-testing");
const {doc, getDoc, setDoc, updateDoc, collection, addDoc} = require("firebase/firestore");

const projectId = "unimentorai-rules-test";
const rules = fs.readFileSync(path.resolve(__dirname, "..", "..", "firestore.rules"), "utf8");

let testEnv;

async function authedDb(uid, claims) {
  return testEnv.authenticatedContext(uid, claims).firestore();
}

async function seed() {
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();
    await setDoc(doc(db, "courses", "published-course"), {
      title: "Cours public",
      description: "Visible en invite",
      language: "fr",
      authorId: "author-1",
      isPublished: true,
      organizationId: null,
    });
    await setDoc(doc(db, "courses", "org1-published-course"), {
      title: "Cours B2B org-1",
      description: "Isolé tenant",
      language: "fr",
      authorId: "author-org",
      isPublished: true,
      organizationId: "org-1",
    });
    await setDoc(doc(db, "courses", "draft-course"), {
      title: "Cours brouillon",
      description: "Visible auteur/admin uniquement",
      language: "fr",
      authorId: "author-1",
      isPublished: false,
    });
    await setDoc(doc(db, "reverse_mentoring_profiles", "mentor-1"), {
      userId: "mentor-1",
      organizationId: null,
      languages: ["fr"],
      competenciesMastered: [{topic: "Leadership", level: 4}],
      competenciesToLearn: [{topic: "IA", level: 2}],
    });
    await setDoc(doc(db, "reverse_mentoring_profiles", "member-org-1"), {
      userId: "member-org-1",
      organizationId: "org-1",
      languages: ["fr"],
      competenciesMastered: [{topic: "Python", level: 3}],
      competenciesToLearn: [{topic: "IA", level: 2}],
    });
    await setDoc(doc(db, "reverse_mentoring_sessions", "sess-org-1"), {
      mentorId: "ent-admin-1",
      menteeId: "member-org-1",
      participants: ["ent-admin-1", "member-org-1"],
      organizationId: "org-1",
      status: "scheduled",
    });
    await setDoc(doc(db, "users", "user-1"), {
      uid: "user-1",
      email: "user@example.com",
      role: "user",
    });
    await setDoc(doc(db, "organizations", "org-1"), {
      name: "Universite Test",
      type: "university",
      status: "active",
      createdAt: {seconds: 1, nanoseconds: 0},
    });
    await setDoc(doc(db, "organizations", "org-2"), {
      name: "Entreprise Autre",
      type: "enterprise",
      status: "active",
      createdAt: {seconds: 1, nanoseconds: 0},
    });
    await setDoc(doc(db, "users", "ent-admin-1"), {
      uid: "ent-admin-1",
      email: "entadmin@example.com",
      role: "enterprise_admin",
      organizationId: "org-1",
      organizationRole: "owner",
    });
    await setDoc(doc(db, "users", "member-org-1"), {
      uid: "member-org-1",
      email: "member@example.com",
      role: "user",
      organizationId: "org-1",
      organizationRole: "member",
    });
    await setDoc(doc(db, "users", "user-org-2"), {
      uid: "user-org-2",
      email: "other@example.com",
      role: "user",
      organizationId: "org-2",
      organizationRole: "member",
    });
  });
}

(async () => {
  testEnv = await initializeTestEnvironment({
    projectId,
    firestore: {rules},
  });

  try {
    await seed();

    const anonDb = testEnv.unauthenticatedContext().firestore();
    await assertSucceeds(getDoc(doc(anonDb, "courses", "published-course")));
    await assertFails(getDoc(doc(anonDb, "courses", "draft-course")));
    await assertFails(getDoc(doc(anonDb, "courses", "org1-published-course")));
    await assertFails(getDoc(doc(anonDb, "reverse_mentoring_profiles", "mentor-1")));

    const userDb = await authedDb("user-1", {role: "user", roles: ["user"]});
    await assertSucceeds(getDoc(doc(userDb, "courses", "published-course")));
    await assertFails(getDoc(doc(userDb, "courses", "org1-published-course")));
    await assertFails(getDoc(doc(userDb, "courses", "draft-course")));
    await assertSucceeds(getDoc(doc(userDb, "users", "user-1")));
    await assertFails(getDoc(doc(userDb, "reverse_mentoring_profiles", "mentor-1")));

    const mentorDb = await authedDb("mentor-1", {role: "mentor", roles: ["mentor"]});
    await assertSucceeds(getDoc(doc(mentorDb, "reverse_mentoring_profiles", "mentor-1")));
    await assertFails(getDoc(doc(mentorDb, "users", "user-1")));

    const adminDb = await authedDb("admin-1", {role: "admin", roles: ["admin"]});
    await assertSucceeds(getDoc(doc(adminDb, "courses", "draft-course")));
    await assertSucceeds(getDoc(doc(adminDb, "reverse_mentoring_profiles", "mentor-1")));
    await assertSucceeds(addDoc(collection(adminDb, "logs"), {msg: "ok"}));

    const entClaims = {
      role: "enterprise_admin",
      roles: ["enterprise_admin"],
      organizationId: "org-1",
      organizationRole: "owner",
    };
    const entAdminDb = await authedDb("ent-admin-1", entClaims);
    await assertSucceeds(getDoc(doc(entAdminDb, "organizations", "org-1")));
    await assertFails(getDoc(doc(entAdminDb, "organizations", "org-2")));
    await assertSucceeds(getDoc(doc(entAdminDb, "users", "member-org-1")));
    await assertFails(getDoc(doc(entAdminDb, "users", "user-org-2")));
    await assertSucceeds(getDoc(doc(entAdminDb, "courses", "org1-published-course")));
    await assertSucceeds(getDoc(doc(entAdminDb, "reverse_mentoring_profiles", "member-org-1")));
    await assertSucceeds(getDoc(doc(entAdminDb, "reverse_mentoring_sessions", "sess-org-1")));
    await assertFails(setDoc(doc(entAdminDb, "organizations", "hijack"), {
      name: "X",
      type: "school",
      status: "active",
    }));

    const cheatDb = await authedDb("cheat-1", {role: "user", roles: ["user"]});
    await assertFails(setDoc(doc(cheatDb, "users", "cheat-1"), {
      uid: "cheat-1",
      email: "c@example.com",
      role: "user",
      organizationId: "org-1",
    }));

    await assertFails(updateDoc(doc(userDb, "users", "user-1"), {
      organizationId: "org-1",
      organizationRole: "owner",
    }));

    await assertFails(getDoc(doc(userDb, "reverse_mentoring_profiles", "member-org-1")));
    await assertFails(getDoc(doc(userDb, "reverse_mentoring_sessions", "sess-org-1")));

    console.log("Firestore rules integration tests passed");
  } finally {
    await testEnv.cleanup();
  }
})().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

