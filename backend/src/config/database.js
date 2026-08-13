const dialectOptions = {};

if (process.env.DB_SSL === "true" || (process.env.DB_HOST && process.env.DB_HOST !== "localhost" && process.env.DB_HOST !== "127.0.0.1")) {
  dialectOptions.ssl = {
    require: true,
    rejectUnauthorized: false,
  };
}

module.exports = {
  dialect: "postgres",
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 5432,
  username: process.env.DB_USER || "postgres",
  password: process.env.DB_PASS,
  database: process.env.DB_NAME || "desafio-amigo",
  dialectOptions,
  define: {
    timestamps: true,
    underscored: true,
    underscoredAll: true,
  },
};
