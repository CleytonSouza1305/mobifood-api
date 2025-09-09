"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserRequestSchema = void 0;
const zod_1 = __importDefault(require("zod"));
const roleEnum = zod_1.default.enum(['user', 'delivery']);
exports.CreateUserRequestSchema = zod_1.default.object({
    username: zod_1.default.string().min(2).max(100),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6).max(100),
    phone: zod_1.default.string().min(10).max(15),
    role: roleEnum.optional().default('user'),
});
