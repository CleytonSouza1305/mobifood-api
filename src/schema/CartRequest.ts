import z from "zod";

export const AddItemToCartRequest = z.object({
  itemId: z.number(), 
  quantity: z.number()
})