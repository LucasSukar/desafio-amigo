import express from "express";
import cors from "cors";

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
    this.server.use(cors());
  }

  routes() {
    this.server.use(userRoute);
    this.server.use(publiRoute);
  }
}

export default new App().server;
