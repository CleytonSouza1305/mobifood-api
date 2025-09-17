import z from "zod";

const stateEnum = z.enum([
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO",
  "MA", "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI",
  "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
]);

const addressRole = z.enum(["Casa", "Trabalho", "Escola", "Outros"])

const stateSchema = z.string().transform((s) => s.toUpperCase()).pipe(stateEnum);

export const CreateAddressRequestSchema = z.object({
  street: z.string().min(2).max(100),
  city: z.string().min(2).max(100),
  number: z.number(),
  state: stateSchema,
  role: addressRole.optional().default('Casa'),
  isActive: z.boolean().optional()
})

export const UpdateAddressRequestSchema = z.object({
  street: z.string().min(2).max(100).optional(),
  city: z.string().min(2).max(100).optional(),
  number: z.number().optional(),
  state: stateSchema.optional(),
  role: addressRole.optional(),
  isActive: z.boolean().optional()
})