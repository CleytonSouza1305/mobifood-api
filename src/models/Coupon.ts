import { prisma } from "../database";
import { DiscountType } from "../utils/generateWeeklyCoupons";

export interface CouponsFilter {
  page: number;
  pageSize: number;
  where: {
    code?: {
      contains: string;
      mode?: "insensitive" | "default";
    };
    is_active?: {
      equals: boolean;
    };
    couponName?: {
      contains: string;
      mode?: "insensitive" | "default";
    };
  };
  sortBy: string;
  order: "asc" | "desc";
}

export interface CouponType {
  couponName: string;
  code: string;
  description: string;
  discountType: DiscountType;
  discountValue: number;
  startsAt: Date;
  expiresAt: Date;
  is_active: boolean;
}

export class Coupon {
  static allCoupon = async (filter: CouponsFilter) => {
    const coupons = await prisma.coupons.findMany({
      where: filter.where,
      orderBy: {
        [filter.sortBy]: filter.order,
      },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    });

    const count = await prisma.coupons.count({ where: filter.where });

    return {
      coupons,
      page: filter.page,
      pageSize: filter.pageSize,
      count,
    };
  };

  static create = async (coupon: CouponType) => {
    const newCoupon = await prisma.coupons.create({
      data: {
        ...coupon,
      },
    });

    return newCoupon;
  };

  static getCouponById = async (couponId: number) => {
    const coupon = await prisma.coupons.findUnique({
      where: { id: couponId },
    });

    return coupon;
  };

  static getCouponUsageByUserId = async (userId: number) => {
    const couponsUsaged = await prisma.usageCoupon.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: {
        coupon: true,
      },
    });

    const coupons = couponsUsaged.map((c) => ({
      ...c.coupon,
      usage_at: c.createdAt,
    }));
    return coupons;
  };

  static validadeCouponCode = async (code: string) => {
    const coupons = await prisma.coupons.findUnique({
      where: { code },
    });

    return coupons;
  };

  static getCouponAvailable = async (filter: CouponsFilter) => {
    const coupons = await prisma.coupons.findMany({
      where: filter.where,
      orderBy: {
        [filter.sortBy]: filter.order,
      },
      skip: (filter.page - 1) * filter.pageSize,
      take: filter.pageSize,
    });

    const count = await prisma.coupons.count({ where: filter.where });
    const actualDate = new Date()

    const avaliableCoupons = coupons.filter((c) => {
      if (!c.expiresAt) {
        return true
      } 

      return new Date(c.expiresAt) >= actualDate
    })

    return {
      coupons: avaliableCoupons,
      page: filter.page,
      pageSize: filter.pageSize,
      count,
    };
  };

  static turnCouponUsaged = async (userId: number, couponId: number) => {
    await prisma.usageCoupon.create({
      data: {
        couponId,
        userId
      }
    })
  }
}
