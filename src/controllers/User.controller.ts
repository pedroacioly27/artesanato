import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export class UserController {
  async create(req: Request, res: Response) {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }
    const userExists = await userRepository.findOne({
      where: { email: email },
    });

    if (userExists) {
      throw new BadRequestError("E-mail já cadastrado");
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = userRepository.create({
      name,
      email,
      password: hashPassword,
    });

    await userRepository.save(newUser);

    const { password: _, ...user } = newUser;
    return res.status(201).json(user);
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
      throw new BadRequestError("Todos os campos são obrigatórios");
    }
    const user = await userRepository.findOne({
      where: { email: email },
    });

    if (!user) {
      throw new BadRequestError("E-mail ou Senha inválidos");
    }

    const verifyPass = await bcrypt.compare(password, user.password);

    if (!verifyPass) {
      throw new BadRequestError("E-mail ou Senha inválidos");
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_PASS ?? "", {
      expiresIn: "8h",
    });

    const { password: _, ...userLogin } = user;

    res.json({ user: userLogin, token });
  }

  async getProfile(req: Request, res: Response) {
    return res.status(200).json(req.user);
  }

  async updateProfile(req: Request, res: Response) {
    const { name, email, password } = req.body;
    const userID = req.user.id;

    const user = await userRepository.findOne({
      where: {
        id: userID,
      },
    });

    if (!user) {
      throw new BadRequestError("Usuário não encontrado!");
    }

    if (name) user.name = name;

    if (email) {
      const emailExists = await userRepository.findOne({ where: { email } });
      if (emailExists && emailExists.id !== user.id) {
        throw new BadRequestError("Email já cadastrado!");
      }
      user.email = email;
    }
    if (password) {
      const hashPassword = await bcrypt.hash(password, 10);
      user.password = hashPassword;
    }

    await userRepository.save(user);

    const { password: _, ...userUpdated } = user;

    return res.status(200).json(userUpdated);
  }
}
