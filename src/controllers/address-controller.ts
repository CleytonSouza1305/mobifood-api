import { Handler } from "express";
import { HttpError } from "../error/HttpError";
import { JwtPayload } from "jsonwebtoken";
import { Address } from "../models/Address";
import { User } from "../models/User";

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

  const addressByUserId = await Address.addressByUserId(id)
  res.json(addressByUserId)
};

export { listUserAddresses }