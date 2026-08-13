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
    this.isSynced = false;
    this.syncError = null;
    this.syncPromise = null;
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
  }

  async checkConnectionAndSync() {
    if (this.isSynced) return;
    if (this.syncError) throw this.syncError;
    if (this.syncPromise) return this.syncPromise;

    this.syncPromise = (async () => {
      try {
        await this.syncTables();
        this.isSynced = true;
      } catch (err) {
        this.syncError = err;
        this.syncPromise = null;
        throw err;
      }
    })();

    return this.syncPromise;
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
