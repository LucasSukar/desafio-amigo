import { Router } from "express";
import MessageController from "../controllers/MessageController";
import auth from "../middlewares/auth";

const messageRoute = new Router();

messageRoute.get("/messages", auth, MessageController.conversations);
messageRoute.get("/messages/:userId", auth, MessageController.index);
messageRoute.post("/messages/:userId", auth, MessageController.store);

export default messageRoute;
