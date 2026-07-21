import { Router } from "express";
import UserController from "../controllers/UserController";

const userRoute = new Router();

userRoute.post("/users", UserController.store);

export default userRoute;
