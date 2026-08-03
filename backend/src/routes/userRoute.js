import { Router } from "express";
import multer from "multer";

import UserController from "../controllers/UserController";
import SessionController from "../controllers/SessionController";
import auth from "../middlewares/auth";
import uploadConfig from "../middlewares/upload";

const userRoute = new Router();
const upload = multer(uploadConfig);

userRoute.post("/users", UserController.store);
userRoute.post("/sessions", SessionController.store);

userRoute.get("/users/me", auth, UserController.me);
userRoute.put("/users", auth, UserController.update);
userRoute.put("/users/avatar", auth, upload.single("avatar"), UserController.avatar);

export default userRoute;
