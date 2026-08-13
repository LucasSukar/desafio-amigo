// Ponto de entrada para a Vercel (serverless function).
// Registra o Sucrase para transpilar import/export em tempo de execução,
// depois delega para o app Express normal.
require("dotenv").config();

// Registra o Sucrase para suportar import/export no código do backend
require("sucrase/register");

// Importa o app Express (usa import/export — agora transpilado pelo Sucrase)
// O caminho é relativo à pasta /api, então ../backend/src/app
const app = require("../backend/src/app").default;

// A Vercel espera que a função exporte um handler (o servidor Express)
module.exports = app;
