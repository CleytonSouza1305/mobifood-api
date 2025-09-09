"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const error_handler_1 = require("./middleware/error-handler");
const user_router_1 = __importDefault(require("./routers/user-router"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(error_handler_1.errorHandler);
app.use('/auth', user_router_1.default);
const PORT = process.env.PORT || 1000;
app.listen(PORT, () => console.log(`Aplicação rodando na porta: ${PORT}`));
