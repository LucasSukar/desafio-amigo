import Sequelize from "sequelize";
import path from "path";
import { Umzug, SequelizeStorage } from "umzug";
import databaseConfig from "../config/database";
import User from "../models/User";
import Post from "../models/Post";
import PostLike from "../models/PostLike";
import Comment from "../models/Comment";
import Message from "../models/Message";

const models = [User, Post, PostLike, Comment, Message];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);

    models
      .map((model) => model.init(this.connection))
      .map((model) => model.associate && model.associate(this.connection.models));

    // Roda as migrações automaticamente ao iniciar.
    // Isso é seguro pois o Umzug controla quais migrations já foram executadas
    // e não repete as que já rodaram (usa a tabela SequelizeMeta).
    this.runMigrations();
  }

  async runMigrations() {
    try {
      const umzug = new Umzug({
        migrations: {
          glob: path.resolve(__dirname, "..", "migrations", "*.js"),
          resolve: ({ name, path: migPath, context }) => {
            // Compatibilidade com migration files que usam CommonJS (module.exports)
            // eslint-disable-next-line @typescript-eslint/no-var-requires
            const migration = require(migPath);
            return {
              name,
              up: async () => migration.up(context, Sequelize),
              down: async () => migration.down(context, Sequelize),
            };
          },
        },
        context: this.connection.getQueryInterface(),
        storage: new SequelizeStorage({ sequelize: this.connection }),
        logger: console,
      });

      await umzug.up();
      console.log("✅ Migrações executadas com sucesso.");
    } catch (err) {
      console.error("❌ Erro ao executar migrações:", err);
    }
  }
}

export default new Database();
