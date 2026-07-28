import { Router } from "express";

import PostController from "../controllers/PostController";
import LikeController from "../controllers/LikeController";

import auth from "../middlewares/auth";
import authOptional from "../middlewares/authOptional";

const postRoute = new Router();

postRoute.get("/post", authOptional, PostController.index);
postRoute.get("/post/me", auth, PostController.me);
postRoute.get("/post/:id", authOptional, PostController.show);

postRoute.use(auth);
postRoute.post("/post", PostController.store);
postRoute.put("/post/:id", PostController.update);
postRoute.delete("/post/:id", PostController.delete);
postRoute.post("/post/:id/like", LikeController.toggle);

export default postRoute;
