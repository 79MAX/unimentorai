import axios from "axios";

class OllamaClient {
  constructor() {
    this.baseURL = "http://localhost:11434";
  }

  async generate(model, prompt) {
    return axios.post(`${this.baseURL}/api/generate`, {
      model,
      prompt,
      stream: false
    }, {
      timeout: 60000
    });
  }

  async listModels() {
    const res = await axios.get(`${this.baseURL}/api/tags`);
    return res.data;
  }
}

export default new OllamaClient();
