import express from "express";

const userRouter = express.Router();
import { getAllUsers, register, login } from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-user";

userRouter.get('/users', getAllUsers);
userRouter.post('/users/register', register);
userRouter.post('/users/login', login);
userRouter.get('/users/me', authMiddleware, (req, res) => {
  console.log(req)
  res.json(true);
});

export default userRouter;