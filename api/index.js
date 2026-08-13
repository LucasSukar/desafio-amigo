// Ponto de entrada padrão para as Serverless Functions da Vercel.
// Carrega as variáveis de ambiente e ativa o Sucrase em runtime.
const path = require("path");
const fs = require("fs");
const dotenv = require("dotenv");

const loadEnv = (dir) => {
  const files = [".env.development.local", ".env"];
  for (const file of files) {
    const fullPath = path.resolve(dir, file);
    if (fs.existsSync(fullPath)) {
      dotenv.config({ path: fullPath });
    }
  }
};

loadEnv(path.resolve(__dirname, ".."));
loadEnv(path.resolve(__dirname, "../backend"));

require("sucrase/register");

// Importa o app Express configurado
const app = require("../backend/src/app").default;

module.exports = app;
