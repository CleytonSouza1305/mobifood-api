import { Handler } from "express";
import { HttpError } from "../error/HttpError";
import { JwtPayload } from "jsonwebtoken";
import { Address } from "../models/Address";
import { User } from "../models/User";
import { CreateAddressRequestSchema } from "../schema/AddressRequest";
import { ZodError } from "zod";

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

  const addressByUserId = await Address.addressByUserId(id);
  res.json(addressByUserId);
};

// POST auth/users/:id/address
const createAddress: Handler = async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const body = CreateAddressRequestSchema.parse(req.body);

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

    const limitAddress = await Address.addressByUserId(id)

    if (limitAddress.length < 1) {
      body.isActive = true
    }

    if (limitAddress.length >= 5) {
      throw new HttpError(400, "Limite de endereços atingido.");
    }
 
    if (!body.isActive) body.isActive = false

    const newAddress = await Address.createAddress(id, body.street, body.city, String(body.number), body.state, body.role, body.isActive)

    res.json(newAddress)
  } catch (error) {
    if (error instanceof ZodError) {
      const errorFIeld = error.issues.map(el => el.path.join(".")).join(", ")

      if (errorFIeld.includes('street')) {
        throw new HttpError(400, 'A rua é obrigatória.')
      }

      if (errorFIeld.includes('city')) {
        throw new HttpError(400, 'A cidade é obrigatória.')
      }

      if (errorFIeld.includes('number')) {
        throw new HttpError(400, 'O número da residência é obrigatório / Formato de número inválido.')
      }

      if (errorFIeld.includes('state')) {
        throw new HttpError(400, "O estado é obrigatório. Exemplo: 'SP/RJ/BA' ")
      }
    } else {
      next(error);
    }
  }
};

// GET auth/users/:id/address/:addressId
const addressById: Handler = async (req, res, next) => {
  try {
    const addressId = Number(req.params.addressId)
    const id = Number(req.params.id)

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

    const address = await Address.addressById(id, addressId)
    if (!address) {
      throw new HttpError(404, "Endereço não encontrado.");
    }
    
    res.json(address)
  } catch (error) {
    next(error)
  }
}

export { listUserAddresses, createAddress, addressById };
