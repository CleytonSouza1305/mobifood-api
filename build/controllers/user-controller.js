"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = void 0;
const User_1 = require("../models/User");
//GET /auth/users
const getAllUsers = async (req, res, next) => {
    try {
        const users = await User_1.User.allUsers();
        res.json(users);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
