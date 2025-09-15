import { Handler } from "express";
import { User } from "../models/User";
import {
  CreateUserRequestSchema,
  LoginRequestSchema,
  UpdateUserRequestSchema,
} from "../schema/UserRequest";
import { HttpError } from "../error/HttpError";
import bcrypt from "bcryptjs";
import { ZodError } from "zod";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// GET /auth/users
const getAllUsers: Handler = async (req, res, next) => {
  try {
    const users = await User.allUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
};

// POST /auth/users/register
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
        res.status(400).json({
          message: "Nome de usuário deve conter no mínimo 3 caracteres.",
        });
        return;
      } else if (errorPath.includes("email")) {
        res.status(400).json({ message: "Email inválido." });
        return;
      } else if (errorPath.includes("password")) {
        res.status(400).json({
          message: "Senha inválida. A senha deve ter no mínimo 6 caracteres.",
        });
        return;
      } else if (errorPath.includes("phone")) {
        res.status(400).json({ message: "Telefone inválido." });
        return;
      } else if (errorPath.includes("role")) {
        res.status(400).json({
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

// POST /auth/users/login
const login: Handler = async (req, res, next) => {
  try {
    const body = LoginRequestSchema.parse(req.body);

    const user = await User.findByEmail(body.email);
    if (!user) {
      throw new HttpError(401, "Credenciais inválidas.");
    }

    const isValidPassword = bcrypt.compareSync(body.password, user.password);
    if (!isValidPassword) {
      throw new HttpError(401, "Credenciais inválidas.");
    }

    const payload = { id: user.id, email: user.email, role: user.role };

    const JWT_SECRET = process.env.JWT_SECRET;
    if (!JWT_SECRET) {
      throw new HttpError(500, "JWT_SECRET não configurado no ambiente.");
    }

    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
    res.json({ token });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorPath = error.issues.map((el) => el.path.join(".")).join(", ");

      if (errorPath.includes("email")) {
        res.status(400).json({ message: "Email inválido." });
        return;
      } else if (errorPath.includes("password")) {
        res.status(400).json({
          message: "Senha inválida. A senha deve ter no mínimo 6 caracteres.",
        });
        return;
      } else {
        res.status(400).json({ message: "Erro de validação nos campos." });
      }
    } else if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
      return;
    }

    next(error);
  }
};

// GET /auth/users/me
const me: Handler = async (req, res, next) => {
  try {
    res.json(req.user);
  } catch (error) {
    next(error);
  }
};

// GET /auth/users/:id
const getUserById: Handler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const user = await User.findById(id);
    if (!user) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    res.json(user);
  } catch (error) {
    next(error);
  }
};

// PUT /auth/users/:id
const updateUserById: Handler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = UpdateUserRequestSchema.parse(req.body);

    const existsUser = await User.findById(id);
    if (!existsUser) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }
    const user = req.user as JwtPayload & { id: number; role: string };

    if (+user.id !== id && user.role !== "admin") {
      throw new HttpError(403, "Acesso negado.");
    }

    const updatedUser = await User.updateUser(body, id);
    res.json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// DELETE /auth/users/:id
const deleteUserById: Handler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    const existsUser = await User.findById(id);
    if (!existsUser) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    if (!req.isAutorizated) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }
    const user = req.user as JwtPayload & { id: number; role: string };

    if (+user.id !== id && user.role !== "admin") {
      throw new HttpError(403, "Acesso negado.");
    }

    const deletedUser = await User.deleteUser(id);
    res.json(deletedUser);
  } catch (error) {
    next(error);
  }
};

// GET /auth/users/:id/addresses
const listUserAddresses: Handler = async (req, res, next) => {
  const id = Number(req.params.id);

  const existsUser = await User.findById(id);
  if (!existsUser) {
    throw new HttpError(404, "Usuário não encontrado.");
  }

  if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
    throw new HttpError(401, "Usuário não autenticado.");
  }
  const user = req.user as JwtPayload & { id: number; role: string };

  if (+user.id !== id && user.role !== "admin") {
    throw new HttpError(403, "Acesso negado.");
  }

  const addressByUserId = await User.addressByUserId(id)
  res.json(addressByUserId)
};

export {
  getAllUsers,
  register,
  login,
  me,
  getUserById,
  updateUserById,
  deleteUserById,
  listUserAddresses,
};
