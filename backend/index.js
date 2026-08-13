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

loadEnv(__dirname);
loadEnv(path.resolve(__dirname, ".."));

// Importa o express app
const app = require("./src/app").default;

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`Backend rodando na porta ${PORT}`));
