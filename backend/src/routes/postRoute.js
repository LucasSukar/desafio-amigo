import { Router } from "express";

import PostController from "../controllers/PostController";
import LikeController from "../controllers/LikeController";
import CommentController from "../controllers/CommentController";

import auth from "../middlewares/auth";
import authOptional from "../middlewares/authOptional";

const postRoute = new Router();

postRoute.get("/post", authOptional, PostController.index);
postRoute.get("/post/me", auth, PostController.me);
postRoute.get("/post/postDosSeguidores", auth, PostController.postDosSeguidores);
postRoute.get("/post/user/:userId", authOptional, PostController.byUser);
postRoute.get("/post/:id", authOptional, PostController.show);
postRoute.get("/post/:id/comments", authOptional, CommentController.index);

postRoute.use(auth);
postRoute.post("/post", PostController.store);
postRoute.put("/post/:id", PostController.update);
postRoute.delete("/post/:id", PostController.delete);
postRoute.post("/post/:id/like", LikeController.toggle);
postRoute.post("/post/:id/comments", CommentController.store);
postRoute.delete("/post/:postId/comments/:commentId", CommentController.delete);

export default postRoute;
