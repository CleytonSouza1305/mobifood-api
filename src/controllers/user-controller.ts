import { Handler } from "express";
import { User } from "../models/User";

//GET /auth/users
const getAllUsers: Handler = async (req, res, next) => {
  try {
    const users = await User.allUsers();
    res.json(users);
  } catch (error) {
    next(error);
  }
}

export { getAllUsers }