import { Request, Response } from "express";
import { BadRequestError } from "../helpers/api-error";
import { transactionRepository } from "../repositories/transactionRepository";

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    const { description, value, type } = req.body;
    if (!description || !value || !type) {
      throw new BadRequestError("Todos os dados são obrigatórios");
    }
    if (type !== "revenue" && type !== "expenses") {
      throw new BadRequestError("Dados incorretos");
    }

    const data = new Date();
    const dataISO = data.toISOString();

    const newTransaction = transactionRepository.create({
      description,
      value,
      type,
      user: req.user,
      date: dataISO,
    });

    await transactionRepository.save(newTransaction);
    return res.status(201).json(newTransaction);
  }
}
