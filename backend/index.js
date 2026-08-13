require("dotenv").config();
require("sucrase/register");

const app = require("./src/app").default;

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
