import { Router, Request, Response } from "express";
import { UserController } from "./controllers/User.controller";

const routes = Router();

routes.get("/", new UserController().getUsers);
routes.post("/user", new UserController().createUser);

export default routes;
