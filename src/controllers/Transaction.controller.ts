import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/api-error";
import { transactionRepository } from "../repositories/transactionRepository";

export class TransactionController {
  async createTransaction(req: Request, res: Response) {
    const { description, value, type } = req.body;
    if (!description || !value || !type) {
      throw new BadRequestError("Todos os dados são obrigatórios");
    }
    if (
      type !== "revenue" &&
      type !== "expenses" &&
      type !== "entrada" &&
      type !== "saida"
    ) {
      throw new BadRequestError("Dados incorretos");
    }
    let setType = type;
    if (type === "entrada") {
      setType = "revenue";
    }
    if (type === "saida") {
      setType = "expenses";
    }
    const data = new Date();
    const dataISO = data.toISOString();

    const newTransaction = transactionRepository.create({
      description,
      value,
      type: setType,
      user: req.user,
      date: dataISO,
    });

    await transactionRepository.save(newTransaction);
    return res.status(201).json(newTransaction);
  }
  async extract(req: Request, res: Response) {
    const user = req.user;
    const { year, month } = req.query;

    const transactions = await transactionRepository.find({
      where: { user: user },
    });
    let extract = 0;
    let revenue = 0;
    let expenses = 0;
    if (month && !year) {
      throw new BadRequestError(
        "Para pesquisar por mês, precisar adicionar o ano também!"
      );
    }
    if (year) {
      if (month) {
        for (const transaction of transactions) {
          const getYear = transaction.date.getFullYear();
          const getMonth = transaction.date.getMonth() + 1;
          if (
            transaction.type === "revenue" &&
            getYear === Number(year) &&
            getMonth === Number(month)
          ) {
            extract += transaction.value;
            revenue += transaction.value;
          }
          if (
            transaction.type === "expenses" &&
            getYear === Number(year) &&
            getMonth === Number(month)
          ) {
            extract -= transaction.value;
            expenses += transaction.value;
          }
        }
        if (extract === 0 && revenue === 0 && expenses === 0) {
          throw new NotFoundError(
            `Nenhum registro encontrado para o mês ${month} no ano ${year}`
          );
        }
        return res.status(200).json({
          extract: `R$${(extract / 100).toFixed(2)}`,
          revenue: `R$${(revenue / 100).toFixed(2)}`,
          expenses: `R$${(expenses / 100).toFixed(2)}`,
        });
      }
      for (const transaction of transactions) {
        const getYear = transaction.date.getFullYear();

        if (transaction.type === "revenue" && getYear === Number(year)) {
          extract += transaction.value;
          revenue += transaction.value;
        }
        if (transaction.type === "expenses" && getYear === Number(year)) {
          extract -= transaction.value;
          expenses += transaction.value;
        }
      }
      if (extract === 0 && revenue === 0 && expenses === 0) {
        throw new NotFoundError(
          `Nenhum registro encontrado para o ano de ${year}`
        );
      }
      return res.status(200).json({
        extract: `R$${(extract / 100).toFixed(2)}`,
        revenue: `R$${(revenue / 100).toFixed(2)}`,
        expenses: `R$${(expenses / 100).toFixed(2)}`,
      });
    }
    for (const transaction of transactions) {
      if (transaction.type === "revenue") {
        extract += transaction.value;
        revenue += transaction.value;
      }
      if (transaction.type === "expenses") {
        extract -= transaction.value;
        expenses += transaction.value;
      }
    }
    if (extract === 0 && revenue === 0 && expenses === 0) {
      throw new NotFoundError(`Nenhum registro encontrado nessa conta`);
    }
    return res.status(200).json({
      extract: `R$${(extract / 100).toFixed(2)}`,
      revenue: `R$${(revenue / 100).toFixed(2)}`,
      expenses: `R$${(expenses / 100).toFixed(2)}`,
    });
  }
  async deleteTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;
    console.log(id, user);

    const transaction = await transactionRepository.findOne({
      where: { id: Number(id), user },
      relations: {
        user: true,
      },
    });

    if (!transaction) {
      throw new NotFoundError("Transação não encontrada");
    }
    await transactionRepository.delete({ id: Number(id) });

    return res.status(200).json("Transação deletada com sucesso!");
  }

  async updateTransaction(req: Request, res: Response) {
    const { id } = req.params;
    const { description, value, type } = req.body;

    const transaction = await transactionRepository.findOneBy({
      id: Number(id),
    });

    if (!transaction) {
      throw new BadRequestError("Transaction not found");
    }

    if (description) {
      transaction.description = description;
    }
    if (value) {
      transaction.value = value;
    }
    if (type) {
      if (
        type !== "revenue" &&
        type !== "expenses" &&
        type !== "entrada" &&
        type !== "saida"
      ) {
        throw new BadRequestError("Dados incorretos");
      }
      let setType = type;
      if (type === "entrada") {
        setType = "revenue";
      }
      if (type === "saida") {
        setType = "expenses";
      }
      transaction.type = setType;
    }

    await transactionRepository.save(transaction);

    return res.status(200).json(transaction);
  }
}
