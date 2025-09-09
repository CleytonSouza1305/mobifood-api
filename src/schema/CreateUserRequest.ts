import z from "zod";

const roleEnum = z.enum(['user', 'delivery']);

export const CreateUserRequestSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().min(10).max(15),
  role: roleEnum.optional().default('user'),
});