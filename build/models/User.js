"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const database_1 = require("../database");
class User {
    static allUsers = async () => {
        const users = await database_1.prisma.user.findMany();
        return users;
    };
}
exports.User = User;
