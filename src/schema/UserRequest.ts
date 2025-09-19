import z from "zod";

const roleEnum = z.enum(['user', 'delivery']);

export const CreateUserRequestSchema = z.object({
  username: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  phone: z.string().min(10).max(15),
  role: roleEnum.optional().default('user'),
  favoriteTheme: z.enum(['light', 'dark']).optional()
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).max(100),
})

export const UpdateUserRequestSchema = z.object({
  username: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).max(15).optional(),
  role: roleEnum.optional(),
  favoriteTheme: z.enum(['light', 'dark']).optional()
})

export const UpdateUserPasswordRequestSchema = z.object({
  password: z.string().min(6),
  newPassword: z.string().min(6)
})