import { Handler } from "express";
import { User } from "../models/User";
import { HttpError } from "../error/HttpError";
import { JwtPayload } from "jsonwebtoken";
import { Payment } from "../models/Payment";

// GET api/payment/:userId
const paymentByUser: Handler = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const existsUser = await User.findById(+userId);

    if (!existsUser) {
      throw new HttpError(404, "Usuário não encontrado.");
    }

    const sessionUser = req.user;

    if (
      !sessionUser ||
      typeof sessionUser !== "object" ||
      !("id" in sessionUser)
    ) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = sessionUser as JwtPayload & { id: number; role: string };
    if (user.id !== existsUser.id && user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    const paymentsMethods = await Payment.paymentByUserId(existsUser.id)
    res.json(paymentsMethods)
  } catch (error) {
    next(error);
  }
};

export { paymentByUser };
