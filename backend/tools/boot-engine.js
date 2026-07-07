import path from "path";
import fs from "fs";

const ROOT = path.resolve(process.cwd(), "backend");

console.log("🚀 CLEAN BOOT UNI MENTOR AI");
console.log("📍 ROOT =", ROOT);

function scan(dir) {
  if (!fs.existsSync(dir)) {
    console.log("❌ ROOT NOT FOUND:", dir);
    return [];
  }

  return fs.readdirSync(dir).map(f => path.join(dir, f));
}

const files = scan(ROOT);

console.log("🧠 FILES FOUND:", files.length);
console.log(files.slice(0, 10));

console.log("✅ BOOT OK");
