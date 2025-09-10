import express from "express";

const userRouter = express.Router();
import { getAllUsers, register } from "../controllers/user-controller";

userRouter.get('/users', getAllUsers);
userRouter.post('/users/register', register);

export default userRouter;