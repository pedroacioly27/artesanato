import { Request, Response } from "express";
import { BadRequestError, NotFoundError } from "../helpers/api-error";
import { orderRepository } from "../repositories/orderRepository";
import { transactionRepository } from "../repositories/transactionRepository";
import { recordRepository } from "../repositories/recordRepository";

export class OrderController {
  async createOrder(req: Request, res: Response) {
    const { description, date, received, total } = req.body;
    const user = req.user;

    if (!description || !date || !received || !total) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }

    const newOrder = orderRepository.create({
      description,
      date,
      received,
      total,
      user,
    });

    const data = new Date();
    const dataISO = data.toISOString();

    const newTransaction = transactionRepository.create({
      description,
      date: dataISO,
      type: "revenue",
      user,
      value: received,
    });

    const newRecord = recordRepository.create({
      description,
      total,
      user,
    });

    await orderRepository.save(newOrder);
    await transactionRepository.save(newTransaction);
    await recordRepository.save(newRecord);

    res.status(201).json("Encomenda cadastrada com sucesso!");
  }

  async updateOrder(req: Request, res: Response) {
    const { id } = req.params;
    const { description, date, received, total } = req.body;

    const order = await orderRepository.findOne({ where: { id: Number(id) } });

    if (!order) {
      throw new NotFoundError("Encomenda não encontrada!");
    }

    if (description) {
      order.description = description;
    }
    if (date) {
      order.date = date;
    }
    if (received) {
      order.received = received;
    }
    if (total) {
      order.total = total;
    }

    await orderRepository.save(order);

    return res.status(200).json(order);
  }
}
