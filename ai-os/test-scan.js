import scanner from "./project-scanner.js";

const files = scanner.scanProject();

console.log(
  "FILES FOUND:",
  files.length
);

console.log(
  files.slice(0, 5)
);
