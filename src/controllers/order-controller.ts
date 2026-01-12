import { Handler } from "express";
import { User } from "../models/User";
import { HttpError } from "../error/HttpError";
import { Order } from "../models/Order";

// order/user/:id
const ordersByUserId: Handler = async (req, res, next) => {
  try {
    const userId = Number(req.params.id);

    const existsUser = await User.findById(userId);
    if (!existsUser) throw new HttpError(404, "Usuário não encontrado.");

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    if (req.user.id !== userId && req.user.role !== "admin") {
      throw new HttpError(403, "Busca inválida, você não tem permissão.");
    }

    const orders = await Order.ordersByUserId(userId)
    res.json(orders)
  } catch (error) {
    next(error);
  }
};

export { ordersByUserId };
