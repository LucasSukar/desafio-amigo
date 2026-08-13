// Ponto de entrada padrão para as Serverless Functions da Vercel.
// Carrega as variáveis de ambiente e ativa o Sucrase em runtime.
require("dotenv").config();
require("sucrase/register");

// Importa o app Express configurado
const app = require("../backend/src/app").default;

module.exports = app;
