import z from "zod";

const type = z.enum(["FIXED", "PERCENTAGE", "DELIVERY"])

const CreateCouponRequestSchema = z.object({
  couponName: z.string(),
  description: z.string(),
  discountType: type.optional().default("FIXED"),
  discountValue: z.number(),
  usageLimit: z.number().optional(),
  userUsageLimit: z.number(),

  // O 'coerce' força a conversão da string recebida para um objeto Date
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional(),
  is_active: z.boolean().optional()
})

const CreateRandomCouponSchema = z.object({
  startsAt: z.coerce.date().optional(),
  expiresAt: z.coerce.date().optional()
})

export { CreateCouponRequestSchema, CreateRandomCouponSchema }