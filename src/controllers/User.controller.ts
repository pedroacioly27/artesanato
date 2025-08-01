import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, ServerError } from "../helpers/api-error";

export class UserController {
  async getUsers(req: Request, res: Response) {
    const users = await userRepository.find();
    return res.status(200).json(users);
  }

  async createUser(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }
    const userExists = await userRepository.findOne({
      where: { email: email },
    });

    if (userExists) {
      throw new BadRequestError("Email já cadastrado");
    }

    return res.status(201).json("ok");
  }
}
