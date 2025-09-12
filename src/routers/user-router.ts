import express from "express";

const userRouter = express.Router();
import { getAllUsers, register, login, me } from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-user";

userRouter.get('/users', getAllUsers);
userRouter.post('/users/register', register);
userRouter.post('/users/login', login);
userRouter.get('/users/me', authMiddleware, me);

export default userRouter;