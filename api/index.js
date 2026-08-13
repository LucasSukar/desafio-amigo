// Ponto de entrada para a Vercel (serverless function).
// A Vercel instala as dependências do backend/package.json via "installCommand"
// configurado no vercel.json. O Sucrase é registrado aqui para transpilar
// os arquivos que usam import/export (ESModules).

require("dotenv").config();

// Registra o Sucrase a partir do node_modules do backend
require("../backend/node_modules/sucrase/register");

// Importa o app Express (usa import/export — agora transpilado pelo Sucrase)
const app = require("../backend/src/app").default;

// A Vercel espera que a função exporte um handler (o servidor Express)
module.exports = app;
