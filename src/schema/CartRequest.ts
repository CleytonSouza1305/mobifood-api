import z from "zod";

export const AddItemToCartRequest = z.object({
  cartId: z.number(), 
  itemId: z.number(), 
  quantity: z.number()
})