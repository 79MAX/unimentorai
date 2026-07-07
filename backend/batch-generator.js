const generateCertificate = require("./generate-pdf");

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// 🧠 retry sécurisé (évite récursion infinie)
async function safeGenerate(data, retries = 2) {
  for (let i = 0; i <= retries; i++) {
    try {
      return await generateCertificate(data);
    } catch (err) {
      if (i === retries) throw err;
      console.log(`⚠ Retry ${i + 1}/${retries} - ${data.name}`);
      await delay(500);
    }
  }
}

// 🔐 ID ultra unique (évite collisions batch)
function generateId(index) {
  return `UAI-${Date.now()}-${index}-${Math.floor(Math.random() * 10000)}`;
}

async function generateBatch(users, concurrency = 3) {

  console.log("🚀 Batch started");
  console.log(`👥 Users: ${users.length}`);
  console.log(`⚙️ Concurrency: ${concurrency}`);

  let index = 0;
  let active = 0;

  const results = [];
  const errors = [];

  return new Promise((resolve) => {

    const next = () => {

      // 🏁 fin batch
      if (index >= users.length && active === 0) {
        console.log("🎉 Batch completed");
        console.log(`✔ Success: ${results.length}`);
        console.log(`❌ Errors: ${errors.length}`);

        return resolve({ results, errors });
      }

      // ⚙️ contrôle concurrence
      while (active < concurrency && index < users.length) {

        const currentIndex = index++;
        const user = users[currentIndex];
        active++;

        const certData = {
          name: user.name,
          course: user.course,
          id: generateId(currentIndex),
          date: new Date().toISOString().split("T")[0]
        };

        safeGenerate(certData)
          .then(file => {
            console.log(`✔ ${user.name}`);
            results.push({ user: user.name, file });
          })
          .catch(err => {
            console.log(`❌ ${user.name}: ${err.message}`);
            errors.push({ user: user.name, error: err.message });
          })
          .finally(() => {
            active--;
            next();
          });
      }
    };

    next();
  });
}

module.exports = generateBatch;

