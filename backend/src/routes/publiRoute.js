import { Router } from "express";
import PubliController from "../controllers/PubliController";

const publiRoute = new Router();

publiRoute.get("/publi", PubliController.index);

export default publiRoute;
