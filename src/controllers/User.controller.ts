import { Request, Response } from "express";
import { userRepository } from "../repositories/userRepository";
import { BadRequestError, NotFoundError } from "../helpers/api-error";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { transactionRepository } from "../repositories/transactionRepository";

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
}
