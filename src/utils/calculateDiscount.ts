import { discountTypeEnum } from "../generated/prisma";

function calculateDiscount(orderTotal: number, discountType: discountTypeEnum, discountValue: any) {
  const total = Number(orderTotal);
  const val = Number(discountValue);

  let discountedPrice = total;

  if (discountType === "PERCENTAGE") {
    const discountAmount = total * (val / 100);
    discountedPrice = total - discountAmount;
  } else if (discountType === "FIXED") {
    discountedPrice = total - val;
  }

  if (discountedPrice < 0) {
    discountedPrice = 0;
  }

  return discountedPrice.toFixed(2);
}

export default calculateDiscount;