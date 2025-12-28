import { Handler } from "express";
import { Coupon, CouponsFilter } from "../models/Coupon";

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
    }

    if (code) {
      filter.where.code = {
        contains: String(code),
        mode: "insensitive"
      }
    }

    if (couponName) {
      filter.where.couponName = {
        contains: String(code),
        mode: "insensitive"
      }
    }

    if (is_active) {
      const active = is_active ? true : false
      filter.where.is_active = {
        equals: active
      }
    }

    const coupons = await Coupon.allCoupon(filter)
    res.status(200).json(coupons)
  } catch (error) {
    next(error);
  }
};
