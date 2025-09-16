import express from "express";

const userRouter = express.Router();
import { getAllUsers, register, login, me, getUserById, updateUserById, deleteUserById } from "../controllers/user-controller";
import { authMiddleware } from "../middleware/auth-user";
import { listUserAddresses, createAddress, addressById, deleteAddress } from "../controllers/address-controller";

// USER
userRouter.get('/users', getAllUsers);
userRouter.post('/users/register', register);
userRouter.post('/users/login', login);
userRouter.get('/users/me', authMiddleware, me);
userRouter.get('/users/:id', authMiddleware, getUserById);
userRouter.put('/users/:id', authMiddleware, updateUserById);
userRouter.delete('/users/:id', authMiddleware, deleteUserById);

// ADDRESS
userRouter.get('/users/:id/addresses',authMiddleware, listUserAddresses);
userRouter.post('/users/:id/address',authMiddleware, createAddress);
userRouter.get('/users/:id/address/:addressId',authMiddleware, addressById);
userRouter.delete('/users/:id/address/:addressId',authMiddleware, deleteAddress);

export default userRouter;