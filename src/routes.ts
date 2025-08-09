import { Router, Request, Response } from "express";
import { UserController } from "./controllers/User.controller";
import { authMiddleware } from "./middlewares/authMiddleware";
import { TransactionController } from "./controllers/Transaction.controller";

const routes = Router();

routes.post("/user", new UserController().create);
routes.post("/login", new UserController().login);

routes.use(authMiddleware);
routes.get("/profile", new UserController().getProfile);
routes.get("/extract", new UserController().extract);
routes.post("/transaction", new TransactionController().createTransaction);

export default routes;
