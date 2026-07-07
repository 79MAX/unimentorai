export const certificateTemplate = ({
  name,
  courseTitle,
  level,
  score,
  certificateId,
  date
}) => {

  return `
<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />

<style>

/* =========================
   🎨 GLOBAL DESIGN SYSTEM
   AFRICAN PREMIUM + MODERN EDTECH
========================= */

body {
  margin: 0;
  font-family: 'Poppins', sans-serif;
  background: linear-gradient(135deg, #0f172a, #1e1b4b, #0b0f2a);
  color: white;
  overflow: hidden;
}

/* =========================
   🌍 AFRICAN ART BACKGROUND
========================= */
.container {
  width: 100%;
  height: 100vh;
  padding: 60px;
  position: relative;
}

.container::before {
  content: "";
  position: absolute;
  inset: 0;
  background: url('/assets/african-pattern.png');
  opacity: 0.06;
  filter: contrast(120%) brightness(90%);
}

/* =========================
   🏆 MAIN FRAME (PREMIUM LUXURY)
========================= */
.frame {
  position: relative;
  z-index: 2;
  border: 3px solid rgba(255, 215, 0, 0.7);
  border-radius: 24px;
  padding: 50px;
  backdrop-filter: blur(12px);
  box-shadow: 0 20px 60px rgba(0,0,0,0.6);
}

/* =========================
   🏅 HEADER
========================= */
.header {
  text-align: center;
  margin-bottom: 30px;
}

.title {
  font-size: 42px;
  font-weight: 800;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #facc15, #f97316);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand {
  font-size: 14px;
  color: #94a3b8;
  margin-top: 5px;
}

/* =========================
   👤 USER SECTION
========================= */
.name {
  text-align: center;
  font-size: 34px;
  font-weight: bold;
  margin-top: 20px;
  color: #ffffff;
}

.subtext {
  text-align: center;
  font-size: 16px;
  color: #cbd5e1;
  margin-top: 10px;
}

/* =========================
   📚 COURSE BLOCK
========================= */
.course {
  text-align: center;
  margin-top: 25px;
  font-size: 20px;
  color: #e2e8f0;
}

.course b {
  color: #facc15;
}

/* =========================
   🧠 BADGE (WOW ELEMENT)
========================= */
.badge {
  margin: 30px auto;
  display: inline-block;
  padding: 12px 24px;
  border-radius: 999px;
  background: linear-gradient(45deg, #f59e0b, #f97316, #ef4444);
  font-weight: bold;
  font-size: 14px;
  box-shadow: 0 10px 30px rgba(245, 158, 11, 0.3);
}

/* =========================
   🏆 SEAL (AUTHORITY MARK)
========================= */
.seal {
  position: absolute;
  top: 25px;
  right: 25px;
  width: 90px;
  opacity: 0.9;
  filter: drop-shadow(0 10px 20px rgba(0,0,0,0.5));
}

/* =========================
   🔏 FOOTER (VERIFICATION)
========================= */
.footer {
  position: absolute;
  bottom: 30px;
  width: 100%;
  text-align: center;
  font-size: 11px;
  color: #94a3b8;
}

.footer strong {
  color: #facc15;
}

</style>
</head>

<body>

<div class="container">

  <div class="frame">

    <img src="/assets/seal-gold.png" class="seal" />

    <!-- HEADER -->
    <div class="header">
      <div class="title">CERTIFICATE OF EXCELLENCE</div>
      <div class="brand">UniMentorAI • Global African AI Academy</div>
    </div>

    <!-- USER -->
    <div class="name">${name}</div>

    <div class="subtext">
      has successfully completed a certified AI learning program
    </div>

    <!-- COURSE -->
    <div class="course">
      Course: <b>${courseTitle}</b>
    </div>

    <!-- BADGE -->
    <div style="text-align:center;">
      <div class="badge">
        Level: ${level} • Score: ${score}%
      </div>
    </div>

    <!-- FOOTER -->
    <div class="footer">
      Certificate ID: <strong>${certificateId}</strong> <br/>
      Issued on: ${date} <br/>
      Verified by UniMentorAI Global Verification System
    </div>

  </div>

</div>

</body>
</html>
  `;
};
