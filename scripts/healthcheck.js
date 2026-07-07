import BackendHealthCheck from "../src/aiops/healthcheck/backend.healthcheck.js";

const checker = new BackendHealthCheck();

checker.run().then((res) => {
  process.exit(res.overall.includes("BLOCKED") ? 1 : 0);
});

