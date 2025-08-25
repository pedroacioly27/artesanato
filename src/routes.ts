import { Router, Request, Response } from "express";
import { UserController } from "./controllers/User.controller";
import { authMiddleware } from "./middlewares/authMiddleware";
import { TransactionController } from "./controllers/Transaction.controller";

const routes = Router();

routes.post("/user", new UserController().create);
routes.post("/login", new UserController().login);

routes.use(authMiddleware);
routes.get("/profile", new UserController().getProfile);
routes.get("/transaction/extract", new TransactionController().extract);
routes.post("/transaction", new TransactionController().createTransaction);
routes.patch("/transaction/:id", new TransactionController().updateTransaction);
routes.delete(
  "/transaction/:id",
  new TransactionController().deleteTransaction
);

export default routes;
