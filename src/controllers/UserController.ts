import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";

export class UserController {
   async getUsers(req: Request, res: Response) {
    const users = await userRepository.find();
    return res.status(200).json(users);
  }
}
