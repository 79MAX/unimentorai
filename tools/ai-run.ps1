import { spawn } from "child_process";

run(model, prompt) {
  return new Promise((resolve) => {

    const child = spawn("ollama", ["run", model], {
      shell: true
    });

    let output = "";
    let error = "";

    child.stdout.on("data", (data) => {
      output += data.toString();
    });

    child.stderr.on("data", (data) => {
      error += data.toString();
    });

    child.on("close", () => {
      resolve({
        model,
        output: output.trim() || null,
        error: error || null
      });
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}