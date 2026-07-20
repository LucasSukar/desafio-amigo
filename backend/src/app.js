import express from "express";

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(express.json());
  }

  routes() {
    this.server.get("/teste", (req, res) => {
      return res.json({ ok: true });
    });
  }
}

export default new App().server;
