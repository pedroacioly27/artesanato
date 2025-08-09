import { AppDataSource } from "../data-source";
import { Transaction } from "../entities/Transaction.entity";

export const transactionRepository = AppDataSource.getRepository(Transaction)

