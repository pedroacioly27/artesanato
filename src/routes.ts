import { Router, Request, Response } from "express";
import { UserController } from "./controllers/User.controller";
import { authMiddleware } from "./middlewares/authMiddleware";
import { TransactionController } from "./controllers/Transaction.controller";
import { OrderController } from "./controllers/Order.controller";
import { RecordController } from "./controllers/Record.controller";

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

routes.post("/order", new OrderController().createOrder);
routes.patch("/order/:id", new OrderController().updateOrder);

routes.delete("/record/:id", new RecordController().deleteRecord);

export default routes;
