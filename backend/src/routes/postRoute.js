import { Router } from "express";

import PostController from "../controllers/PostController";
import LikeController from "../controllers/LikeController";
import CommentController from "../controllers/CommentController";
import auth from "../middlewares/auth";
import authOptional from "../middlewares/authOptional";
import { validate } from "../middlewares/validate";
import { postStoreSchema, postUpdateSchema } from "../schemas/postSchemas";

const postRoute = new Router();

postRoute.get("/post", authOptional, PostController.index);
postRoute.get("/post/me", auth, PostController.me);
postRoute.get("/post/postDosSeguidores", auth, PostController.postDosSeguidores);
postRoute.get("/post/user/:userId", authOptional, PostController.byUser);
postRoute.get("/post/:id", authOptional, PostController.show);
postRoute.get("/post/:id/comments", authOptional, CommentController.index);

postRoute.post("/post", auth, validate(postStoreSchema), PostController.store);
postRoute.put("/post/:id", auth, validate(postUpdateSchema), PostController.update);
postRoute.delete("/post/:id", auth, PostController.delete);

postRoute.post("/post/:id/like", auth, LikeController.toggle);
postRoute.post("/post/:id/comments", auth, CommentController.store);
postRoute.delete("/post/:postId/comments/:commentId", auth, CommentController.delete);

export default postRoute;
