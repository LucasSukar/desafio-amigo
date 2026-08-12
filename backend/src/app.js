import express from "express";
import cors from "cors";
import path from "path";

import publiRoute from "./routes/postRoute";
import userRoute from "./routes/userRoute";

import "./database";

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
  }

  routes() {
    this.server.use(userRoute);
    this.server.use(publiRoute);
  }

  // Captura erros lançados pelos services com { status, message }
  errorHandler() {
    this.server.use((err, req, res, next) => {
      const status = err.status || 500;
      const message = err.message || "Erro interno do servidor.";
      return res.status(status).json({ error: message });
    });
  }
}

export default new App().server;
