import express from "express";

const userRouter = express.Router();
import { getAllUsers, register, login } from "../controllers/user-controller";

userRouter.get('/users', getAllUsers);
userRouter.post('/users/register', register);
userRouter.post('/users/login', login);

export default userRouter;