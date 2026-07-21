import { Router } from "express";
import UserController from "../controllers/UserController";
import SessionController from "../controllers/SessionController";

const userRoute = new Router();

userRoute.post("/users", UserController.store);

userRoute.post("/sessions", SessionController.store);

export default userRoute;
