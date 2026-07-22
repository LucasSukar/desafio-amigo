import express from "express";

import publiRoute from "./routes/postRoute";
import userRoute from "./routes/userRoute";

import "./database";

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
    this.server.use(publiRoute, userRoute);
  }
}

export default new App().server;
