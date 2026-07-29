import { Router } from "express";
import UserController from "../controllers/UserController";
import SessionController from "../controllers/SessionController";
import auth from "../middlewares/auth";

const userRoute = new Router();

userRoute.post("/users", UserController.store);
userRoute.post("/sessions", SessionController.store);

userRoute.put("/users", auth, UserController.update);

export default userRoute;

