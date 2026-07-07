const generateBatch = require("./batch-generator");

// ⚙️ CONFIG
const CONFIG = {
  TOTAL_USERS: 100,
  CONCURRENCY: 3,
  COURSE_NAME: "AI Certification"
};

// 🧠 génération dataset propre
function createUsers(total) {
  return Array.from({ length: total }, (_, i) => ({
    name: `Student ${i + 1}`,
    course: CONFIG.COURSE_NAME
  }));
}

// 🚀 main runner
async function main() {

  console.log("================================");
  console.log("🚀 CERTIFICATE BATCH START");
  console.log(`👥 Users: ${CONFIG.TOTAL_USERS}`);
  console.log(`⚙️ Concurrency: ${CONFIG.CONCURRENCY}`);
  console.log("================================");

  try {

    const users = createUsers(CONFIG.TOTAL_USERS);

    const result = await generateBatch(users, CONFIG.CONCURRENCY);

    console.log("================================");
    console.log("🎉 BATCH COMPLETED");
    console.log(`✔ Success: ${result.results.length}`);
    console.log(`❌ Errors: ${result.errors.length}`);
    console.log("================================");

  } catch (err) {

    console.error("💥 FATAL ERROR IN BATCH");
    console.error(err);

  }
}

main();

