import { Router } from "express";
import PostController from "../controllers/PostController";
import auth from "../middlewares/auth";

const postRoute = new Router();

postRoute.get("/post", PostController.index);

postRoute.use(auth);
postRoute.post("/post", PostController.store);
postRoute.put("/post/:id", PostController.update);
postRoute.delete("/post/:id", PostController.delete);

export default postRoute;
