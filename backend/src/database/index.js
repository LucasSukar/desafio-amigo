import Sequelize from "sequelize";
import databaseConfig from "../config/database";
import User from "../models/User";
import Post from "../models/Post";
import PostLike from "../models/PostLike";
import Comment from "../models/Comment";
import Message from "../models/Message";

const models = [User, Post, PostLike, Comment, Message];

// Suporta connection string direta que o Neon/Vercel injeta
const connectionUrl = process.env.POSTGRES_URL_NON_POOLING || process.env.POSTGRES_URL || process.env.DATABASE_URL;

class Database {
  constructor() {
    this.init();
  }

  init() {
    // Se existir uma URL de conexão (Neon via Vercel), usa ela diretamente
    if (connectionUrl) {
      this.connection = new Sequelize(connectionUrl, {
        dialect: "postgres",
        dialectOptions: {
          ssl: { require: true, rejectUnauthorized: false },
        },
        define: {
          timestamps: true,
          underscored: true,
          underscoredAll: true,
        },
        pool: {
          max: 2,
          min: 0,
          idle: 10000,
          acquire: 30000,
        },
        logging: false,
      });
    } else {
      // Desenvolvimento local: usa variáveis individuais
      this.connection = new Sequelize(databaseConfig);
    }

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));

    // Cria as tabelas e expõe a Promise para que o app possa aguardar antes de servir rotas
    this.syncPromise = this.syncTables();
  }

  async syncTables() {
    try {
      // sync({ force: false }) = CREATE TABLE IF NOT EXISTS para todos os Models
      await this.connection.sync({ force: false });

      // Cria a tabela user_follows manualmente (não tem Model, mas é usada nas queries)
      await this.connection.query(`
        CREATE TABLE IF NOT EXISTS user_follows (
          id SERIAL PRIMARY KEY,
          follower_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          followed_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
          created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
          updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
        );
      `);

      console.log("✅ Tabelas sincronizadas com sucesso.");
    } catch (err) {
      console.error("❌ Erro ao sincronizar tabelas:", err.message);
      throw err;
    }
  }
}

export default new Database();
