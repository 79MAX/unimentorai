import { v4 as uuid } from "uuid";

/* =========================
   🧠 SAAS MEMORY LAYER (TEMP)
   👉 Replace with MongoDB / PostgreSQL later
========================= */

class Database {

  constructor() {
    this.users = new Map();
    this.payments = new Map();
    this.courses = new Map();
    this.sessions = new Map();
    this.webinars = new Map();
  }

  /* =========================
     🔐 SAFE ID GENERATOR
  ========================= */
  generateId(prefix = "") {
    return `${prefix}${uuid()}`;
  }

  /* =========================
     👤 USER SYSTEM
  ========================= */
  createUser({ email, role = "student", plan = "FREE" }) {

    if (!email) throw new Error("Email required");

    const user = {
      id: this.generateId("USR_"),
      email: email.toLowerCase().trim(),
      role,
      plan,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.users.set(user.email, user);

    return user;
  }

  getUser(email) {
    return this.users.get(email?.toLowerCase());
  }

  /* =========================
     💰 PAYMENT SYSTEM
  ========================= */
  savePayment(payment = {}) {

    const record = {
      id: this.generateId("PAY_"),
      ...payment,
      status: payment.status || "PENDING",
      createdAt: new Date().toISOString()
    };

    this.payments.set(record.id, record);

    return record;
  }

  getPayment(id) {
    return this.payments.get(id);
  }

  /* =========================
     🎓 COURSE SYSTEM
  ========================= */
  saveCourse(course = {}) {

    const record = {
      id: this.generateId("CRS_"),
      ...course,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.courses.set(record.id, record);

    return record;
  }

  getCourses() {
    return Array.from(this.courses.values());
  }

  /* =========================
     🎥 WEBINAR SYSTEM (LIVE TRAINING)
  ========================= */
  createWebinar({ title, host, date }) {

    if (!title) throw new Error("Title required");

    const webinar = {
      id: this.generateId("WEB_"),
      title,
      host,
      date,
      participants: [],
      status: "SCHEDULED",
      createdAt: new Date().toISOString()
    };

    this.webinars.set(webinar.id, webinar);

    return webinar;
  }

  addParticipant(webinarId, userId) {

    const webinar = this.webinars.get(webinarId);

    if (!webinar) throw new Error("Webinar not found");

    webinar.participants.push(userId);

    return webinar;
  }

  /* =========================
     🤝 MENTORING / SESSIONS
  ========================= */
  createSession({ userId, mentorId, type = "mentoring" }) {

    const session = {
      id: this.generateId("SES_"),
      userId,
      mentorId,
      type,
      status: "ACTIVE",
      createdAt: new Date().toISOString()
    };

    this.sessions.set(session.id, session);

    return session;
  }

  getSessionsByUser(userId) {
    return Array.from(this.sessions.values())
      .filter(s => s.userId === userId);
  }

}

/* =========================
   🚀 SINGLETON EXPORT (SAAS BEST PRACTICE)
========================= */
export const DB = new Database();

