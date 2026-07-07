const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const { generateQR } = require("./services/qr.service");

// 🌍 CONFIG CENTRALISÉE
const CONFIG = Object.freeze({
  BASE_URL: process.env.BASE_URL || "https://unimentorai.com",
  OUTPUT_DIR: path.resolve(__dirname, "./output/certificates"),
  TIMEOUT: 30000
});

fs.mkdirSync(CONFIG.OUTPUT_DIR, { recursive: true });

// 🧠 SVG cache (immutable)
const svgCache = new Map();

function loadSVG(file) {

  if (svgCache.has(file)) return svgCache.get(file);

  const filePath = path.resolve(
    __dirname,
    `./assets/generated/${file}`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Missing SVG asset: ${file}`);
  }

  const data = fs.readFileSync(filePath, "utf8");

  svgCache.set(file, data);

  return data;
}

// 📦 SVG bundle
const SVG = Object.freeze({
  seal: loadSVG("seal-gold.svg"),
  watermark: loadSVG("watermark.svg"),
  pattern: loadSVG("african-pattern.svg"),
  logo: loadSVG("logo-unimentor.svg")
});

// 🧼 sanitize hardening
function safe(v = "") {

  return String(v)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .trim();
}

// 🔐 validation stricte
function validate(data) {

  if (!data) throw new Error("Missing data");

  const required = ["id", "name", "course"];

  for (const f of required) {
    if (!data[f]) throw new Error(`Missing field: ${f}`);
  }
}

// 🚀 browser singleton
let browser;

// ⚡ PAGE POOL (IMPORTANT PERF)
const pagePool = [];

async function getPage() {

  const b = await getBrowser();

  if (pagePool.length > 0) {
    return pagePool.pop();
  }

  return b.newPage();
}

function releasePage(page) {
  pagePool.push(page);
}

// 🚀 browser
async function getBrowser() {

  if (!browser) {

    browser = await chromium.launch({
      headless: true,
      args: [
        "--no-sandbox",
        "--disable-dev-shm-usage",
        "--disable-gpu"
      ]
    });
  }

  return browser;
}

// 🧾 HTML builder
function buildHTML(data, qr) {

  const name = safe(data.name);
  const course = safe(data.course);
  const id = safe(data.id);
  const date = safe(data.date || new Date().toLocaleDateString());

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8"/>

<style>

@page { size:A4; margin:0; }

body {
  margin:0;
  font-family:Georgia, serif;
}

.container {
  position:relative;
  height:100vh;
  padding:60px;
  border:12px double #c8a24a;
  box-sizing:border-box;
  overflow:hidden;
}

.pattern { position:absolute; inset:0; opacity:0.06; }
.watermark { position:absolute; top:22%; left:12%; opacity:0.05; }

.logo { position:absolute; top:30px; left:30px; width:90px; }

.seal { position:absolute; bottom:45px; right:45px; width:120px; }

.qr { position:absolute; bottom:45px; left:45px; }

.qr img { width:110px; }

.title {
  text-align:center;
  font-size:36px;
  font-weight:bold;
  margin-top:40px;
}

.subtitle {
  text-align:center;
  font-size:18px;
  margin-top:20px;
}

.name {
  text-align:center;
  font-size:46px;
  margin-top:60px;
  font-weight:bold;
}

.course {
  text-align:center;
  font-size:22px;
  margin-top:15px;
  color:#b38b2d;
}

.meta {
  text-align:center;
  font-size:14px;
  margin-top:60px;
}

</style>

</head>

<body>

<div class="container">

  <div class="pattern">${SVG.pattern}</div>
  <div class="watermark">${SVG.watermark}</div>
  <div class="logo">${SVG.logo}</div>

  <div class="title">CERTIFICAT OFFICIEL</div>
  <div class="subtitle">Décerné à</div>

  <div class="name">${name}</div>
  <div class="course">${course}</div>

  <div class="meta">
    ID: ${id} | Date: ${date}
  </div>

  <div class="qr">
    <img src="${qr}" />
  </div>

  <div class="seal">${SVG.seal}</div>

</div>

</body>
</html>
`;
}

// 🧾 MAIN GENERATOR (OPTIMISÉ)
async function generateCertificate(data) {

  validate(data);

  const page = await getPage();

  try {

    const url = `${CONFIG.BASE_URL}/verify/${data.id}`;

    const qr = await generateQR(url);

    await page.setContent(
      buildHTML(data, qr),
      {
        waitUntil: "domcontentloaded",
        timeout: CONFIG.TIMEOUT
      }
    );

    const filePath = path.join(
      CONFIG.OUTPUT_DIR,
      `${safe(data.id)}.pdf`
    );

    await page.pdf({
      path: filePath,
      format: "A4",
      printBackground: true
    });

    return filePath;

  } catch (err) {

    console.error("[CERT ERROR]", {
      id: data?.id,
      message: err.message
    });

    throw err;

  } finally {

    releasePage(page);
  }
}

// 🧹 shutdown propre
async function closeBrowser() {

  if (browser) {

    await browser.close();

    browser = null;
    pagePool.length = 0;
  }
}

module.exports = {
  generateCertificate,
  closeBrowser
};

