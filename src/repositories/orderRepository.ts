import { AppDataSource } from "../data-source";
import { Order } from "../entities/Order.entity";

export const orderRepository = AppDataSource.getRepository(Order)
