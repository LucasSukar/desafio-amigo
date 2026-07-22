import { Router } from "express";

import PostController from "../controllers/PostController";
import LikeController from "../controllers/LikeController";

import auth from "../middlewares/auth";

const postRoute = new Router();

postRoute.get("/post", PostController.index);

postRoute.use(auth);
postRoute.post("/post", PostController.store);
postRoute.put("/post/:id", PostController.update);
postRoute.delete("/post/:id", PostController.delete);
postRoute.post("/post/:id/like", LikeController.toggle);

export default postRoute;
