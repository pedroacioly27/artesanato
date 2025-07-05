import { Router, Request, Response } from "express";
import { UserController } from "./controllers/UserController";

const routes = Router();

routes.get("/", new UserController().getUsers);

export default routes;
