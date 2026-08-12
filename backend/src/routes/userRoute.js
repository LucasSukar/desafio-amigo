import { Router } from "express";
import multer from "multer";

import UserController from "../controllers/UserController";
import SessionController from "../controllers/SessionController";
import auth from "../middlewares/auth";
import uploadConfig from "../middlewares/upload";
import { validate } from "../middlewares/validate";
import { userStoreSchema, userUpdateSchema } from "../schemas/userSchemas";

const userRoute = new Router();
const upload = multer(uploadConfig);

userRoute.post("/users", validate(userStoreSchema), UserController.store);
userRoute.post("/sessions", SessionController.store);

userRoute.get("/users/me", auth, UserController.me);
userRoute.get("/users", auth, UserController.index);
userRoute.get("/users/following", auth, UserController.following);
userRoute.get("/users/:id", auth, UserController.getById);
userRoute.post("/users/:id/follow", auth, UserController.follow);
userRoute.put("/users", auth, validate(userUpdateSchema), UserController.update);
userRoute.put("/users/avatar", auth, upload.single("avatar"), UserController.avatar);
userRoute.delete("/users/me", auth, UserController.destroy);

export default userRoute;
