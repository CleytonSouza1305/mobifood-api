import { Handler } from "express";
import { Coupon, CouponsFilter } from "../models/Coupon";
import {
  CreateCouponRequestSchema,
  CreateRandomCouponSchema,
} from "../schema/CouponRequest";
import { HttpError } from "../error/HttpError";
import { ZodError } from "zod";
import { JwtPayload } from "jsonwebtoken";
import { generateCoupon } from "../utils/generateWeeklyCoupons";

const allCoupons: Handler = async (req, res, next) => {
  try {
    const {
      pageNumber = 1,
      pageSizeNumber = 10,
      code,
      is_active,
      couponName,
      sortBy = "createdAt",
      order = "asc",
    } = req.query;

    const pageSize = Number(pageSizeNumber);
    const page = Number(pageNumber);

    const filter: CouponsFilter = {
      page,
      pageSize,
      where: {},
      sortBy: String(sortBy),
      order: order === "desc" ? "desc" : "asc",
    };

    if (code) {
      filter.where.code = {
        contains: String(code),
        mode: "insensitive",
      };
    }

    if (couponName) {
      filter.where.couponName = {
        contains: String(code),
        mode: "insensitive",
      };
    }

    if (is_active) {
      const active = is_active ? true : false;
      filter.where.is_active = {
        equals: active,
      };
    }

    const coupons = await Coupon.allCoupon(filter);
    res.status(200).json(coupons);
  } catch (error) {
    next(error);
  }
};

const createCoupon: Handler = async (req, res, next) => {
  try {
    if (!req.user || typeof req.user !== "object" || !("id" in req.user)) {
      throw new HttpError(401, "Usuário não autenticado.");
    }

    const user = req.user as JwtPayload & { id: number; role: string };
    if (user.role !== "admin") {
      throw new HttpError(403, "User not authorized.");
    }

    const isRandom = req.query.random === 'true'
    let newCoupon;

    if (!isRandom) {
      const body = CreateCouponRequestSchema.parse(req.body);

      const startsAtDate = body.startsAt || new Date();
      const expiresAtDate =
        body.expiresAt ||
        new Date(new Date().setDate(startsAtDate.getDate() + 7));

      const timestamp = Date.now();
      const data = {
        couponName: body.couponName,
        code: body.couponName + timestamp,
        description: body.description,
        discountType: body.discountType,
        discountValue: body.discountValue,
        startsAt: startsAtDate,
        expiresAt: expiresAtDate,
        is_active: body.is_active ? true : false,
      };

      newCoupon = await Coupon.create(data);
    } else {
      const body = CreateRandomCouponSchema.parse(req.body);
      console.log("Aleatorio...");

      const coupon = await generateCoupon(false, body.startsAt, body.expiresAt);
      newCoupon = await Coupon.create(coupon)
    }

    res.status(200).json(newCoupon);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorFields = error.issues.map((el) => el.path.join("."));

      switch (true) {
        case errorFields.includes("couponName"):
          throw new HttpError(
            400,
            "O nome do cupom é obrigatório e deve ser um texto."
          );

        case errorFields.includes("description"):
          throw new HttpError(400, "A descrição é obrigatória.");

        case errorFields.includes("discountValue"):
          throw new HttpError(
            400,
            "O valor do desconto deve ser um número válido."
          );

        case errorFields.includes("userUsageLimit"):
          throw new HttpError(
            400,
            "O limite de uso por usuário é obrigatório."
          );

        case errorFields.includes("usageLimit"):
          throw new HttpError(400, "O limite total de uso deve ser um número.");

        case errorFields.includes("discountType"):
          throw new HttpError(400, "Tipo de desconto inválido.");

        case errorFields.includes("startsAt") ||
          errorFields.includes("expiresAt"):
          throw new HttpError(
            400,
            "Formato de data inválido para início ou expiração."
          );

        default:
          const field = error.issues[0]?.path.join(".") || "campo desconhecido";
          throw new HttpError(400, `Erro de validação no campo: ${field}`);
      }
    } else {
      next(error);
    }
  }
};

export { allCoupons, createCoupon };
