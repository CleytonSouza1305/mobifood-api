import { Handler } from "express";
import { User } from "../models/User";
import { CreateUserRequestSchema } from "../schema/CreateUserRequest";
import { HttpError } from "../error/HttpError";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import jwt from "jsonwebtoken";

// GET /auth/users
const getAllUsers: Handler = async (req, res, next) => {
  try {
    const users = await User.allUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// POST /auth/register
const register: Handler = async (req, res, next) => {
  try {
    const body = CreateUserRequestSchema.parse(req.body);

    const existsUser = await User.findByEmail(body.email);
    if (existsUser) {
      throw new HttpError(409, "Usuário já cadastrado.");
    }

    const hashedPassword = bcrypt.hashSync(body.password, 10);
    const newUser = await User.createUser(
      body.username,
      body.email,
      hashedPassword,
      body.phone,
      body.role
    );

    res.status(201).json(newUser);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorPath = error.issues.map((el) => el.path.join(".")).join(", ");

      if (errorPath.includes("username")) {
        res
          .status(400)
          .json({
            message: "Nome de usuário deve conter no mínimo 3 caracteres.",
          });
        return;
      } else if (errorPath.includes("email")) {
        res.status(400).json({ message: "Email inválido." });
        return;
      } else if (errorPath.includes("password")) {
        res
          .status(400)
          .json({
            message: "Senha inválida. A senha deve ter no mínimo 6 caracteres.",
          });
        return;
      } else if (errorPath.includes("phone")) {
        res.status(400).json({ message: "Telefone inválido." });
        return;
      } else if (errorPath.includes("role")) {
        res
          .status(400)
          .json({
            message:
              "Função inválida. As funções permitidas são: user, delivery.",
          });
      }

      res
        .status(500)
        .json({ message: `Erro de validação nos campos: ${errorPath}` });
      return;
    } else if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }

    next(error);
  }
};

export { getAllUsers, register };
