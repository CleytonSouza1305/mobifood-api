import { Handler } from "express";
import { Cart } from "../models/Cart";
import { HttpError } from "../error/HttpError";
import { JwtPayload } from "jsonwebtoken";

// GET /api/cart
const getCart: Handler = async (req, res, next) => {
  try {
    const cartId = +req.params.id;

    const cart = await Cart.cartById(cartId);
    if (!cart) {
      throw new HttpError(404, "Cart not found.");
    }

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };
    if (user.id !== cart.userId && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    res.json(cart);
  } catch (error) {
    next(error);
  }
};

// POST /api/cart/add
const addItemToCart: Handler = async (req, res, next) => {
  try {
    
  } catch (error) {
    next(error)
  }
};

export { getCart, addItemToCart };
