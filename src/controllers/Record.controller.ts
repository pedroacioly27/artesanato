import { Request, Response } from "express";
import { recordRepository } from "../repositories/recordRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-error";

export class RecordController {
  async getRecord(req: Request, res: Response) {
    const user = req.user;
    const records = await recordRepository.find({
      where: { user },
    });

    res.status(200).json(records);
  }
  async createRecord(req: Request, res: Response) {
    const { description, total } = req.body;
    const user = req.user;

    if (!description || !total) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }
    const newRecord = recordRepository.create({
      description,
      total,
      user,
    });

    await recordRepository.save(newRecord);

    res.status(201).json("Registro adicionado com sucesso");
  }

  async updateRecord(req: Request, res: Response) {
    const { id } = req.params;
    const { description, total } = req.body;
    const user = req.user;

    const record = await recordRepository.findOne({
      where: { id: Number(id), user },
    });

    if (!record) {
      throw new NotFoundError("Registro não encontrado!");
    }

    if (description) {
      record.description = description;
    }

    if (total) {
      record.total = total;
    }

    await recordRepository.save(record);

    res.status(200).json(record);
  }

  async deleteRecord(req: Request, res: Response) {
    const { id } = req.params;
    const user = req.user;

    const record = await recordRepository.findOne({
      where: { id: Number(id), user },
    });

    if (!record) {
      throw new NotFoundError("Registro não encontrado");
    }

    await recordRepository.delete(record);

    res.status(200).json("Registro deletado com sucesso!");
  }
}
