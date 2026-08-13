const dialectOptions = {};

const host = process.env.DB_HOST || process.env.POSTGRES_HOST || "localhost";
const port = process.env.DB_PORT || process.env.POSTGRES_PORT || 5432;
const username = process.env.DB_USER || process.env.POSTGRES_USER || "postgres";
const password = process.env.DB_PASS || process.env.POSTGRES_PASSWORD;
const database = process.env.DB_NAME || process.env.POSTGRES_DATABASE || "desafio-amigo";

if (process.env.DB_SSL === "true" || (host && host !== "localhost" && host !== "127.0.0.1")) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

module.exports = {
  dialect: "postgres",
  host,
  port,
  username,
  password,
  database,
  dialectOptions,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
