import { Request, Response } from "express";
import { recordRepository } from "../repositories/recordRepository";
import { NotFoundError } from "../helpers/api-error";

export class RecordController {
  async deleteRecord(req: Request, res: Response) {
    const { id } = req.params;

    const record = await recordRepository.findOne({
      where: { id: Number(id) },
    });

    if (!record) {
      throw new NotFoundError("Registro não encontrado");
    }

    await recordRepository.delete(record);

    res.status(200).json("Registro deletado com sucesso!");
  }
}
