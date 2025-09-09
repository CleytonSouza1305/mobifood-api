import express from "express";

const userRouter = express.Router();
import { getAllUsers } from "../controllers/user-controller";

userRouter.get('/users', getAllUsers);

export default userRouter;