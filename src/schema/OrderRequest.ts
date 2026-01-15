import z from "zod";

export const CreateOrderRequestSchema = z.object({
  deliveryAddress: z.string(),
  couponCode: z.string().optional(),
  paymentMethod: z.string()
})