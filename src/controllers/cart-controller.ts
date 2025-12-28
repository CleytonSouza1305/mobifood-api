import { Handler } from "express";
import { Cart } from "../models/Cart";
import { HttpError } from "../error/HttpError";
import { JwtPayload } from "jsonwebtoken";
import { AddItemToCartRequest } from "../schema/CartRequest";
import { ZodError } from "zod";
import { validateProductAndRestaurant } from "../utils/validateProductAndRestaurant";

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

// POST /api/cart
const addItemToCart: Handler = async (req, res, next) => {
  try {
    const body = AddItemToCartRequest.parse(req.body);

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };

    const cart = await Cart.cartById(user.cart.id);
    if (!cart) {
      throw new HttpError(404, "Cart not found.");
    }

    if (user.id !== cart.userId && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    const isValidInsert = await validateProductAndRestaurant(body.itemId);
    if (isValidInsert) {
      await Cart.addItemToCart(user.cart.id, body.itemId, body.quantity);
    }

    res.status(201).json({ message: 'OK' });
  } catch (error) {
    if (error instanceof ZodError) {
      const errorFIeld = error.issues.map((el) => el.path.join(".")).join(", ");
      if (errorFIeld.includes("cartId")) {
        throw new HttpError(400, "Cart id is required.");
      }

      if (errorFIeld.includes("itemId")) {
        throw new HttpError(400, "Item id is required.");
      }

      if (errorFIeld.includes("quantity")) {
        throw new HttpError(400, "The quantity is required.");
      }

      res.json(errorFIeld);
    } else {
      next(error);
    }
  }
};

// PUT /api/cart/:itemId
const updateItemOnCart: Handler = async (req, res, next) => {
  try {
    const quantity = Number(req.body.quantity);
    const itemId = Number(req.params.itemId);

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };

    const cart = await Cart.cartById(user.cart.id);
    if (!cart) {
      throw new HttpError(404, "Cart not found.");
    }

    if (user.id !== cart.userId && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    const updatedItem = await Cart.updateItemCart(
      user.cart.id,
      itemId,
      quantity
    );
    res.status(201).json(updatedItem);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorFIeld = error.issues.map((el) => el.path.join(".")).join(", ");
      if (errorFIeld.includes("cartId")) {
        throw new HttpError(400, "Cart id is required.");
      }

      if (errorFIeld.includes("itemId")) {
        throw new HttpError(400, "Item id is required.");
      }

      if (errorFIeld.includes("quantity")) {
        throw new HttpError(400, "The quantity is required.");
      }

      res.json(errorFIeld);
    } else {
      next(error);
    }
  }
};

// DELETE /api/cart/:id
const deleteItemOnCart: Handler = async (req, res, next) => {
  try {
    const itemId = Number(req.params.itemId);

    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };

    const cart = await Cart.cartById(user.cart.id);
    if (!cart) {
      throw new HttpError(404, "Cart not found.");
    }

    if (user.id !== cart.userId && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    const deletedItem = await Cart.removeItemFromCart(user.cart.id, itemId);
    res
      .status(200)
      .json({ message: "Item deletado com sucesso!", deletedItem });
  } catch (error) {
    next(error);
  }
};

export { getCart, addItemToCart, updateItemOnCart, deleteItemOnCart };
