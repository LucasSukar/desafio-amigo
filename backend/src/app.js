import express from "express";
import cors from "cors";
import path from "path";

import publiRoute from "./routes/postRoute";
import userRoute from "./routes/userRoute";
import messageRoute from "./routes/messageRoute";

import database from "./database";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
    this.errorHandler();
  }

  middlewares() {
    this.server.use(express.json());
    this.server.use(cors());
    this.server.use("/uploads", express.static(path.resolve(__dirname, "..", "uploads")));

    // Aguarda a sincronização do banco antes de atender qualquer rota
    this.server.use(async (req, res, next) => {
      try {
        await database.checkConnectionAndSync();
        next();
      } catch (err) {
        next(err);
      }
    });
  }

  routes() {
    this.server.use(userRoute);
    this.server.use(publiRoute);
    this.server.use(messageRoute);
  }

  errorHandler() {
    this.server.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || "Erro interno do servidor.";
      return res.status(status).json({ error: message });
    });
  }
}

export default new App().server;
