"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const HttpError_1 = require("../error/HttpError");
const errorHandler = (error, req, res, next) => {
    if (error) {
        if (error instanceof HttpError_1.HttpError) {
            res.status(error.status).json({ message: error.message });
        }
        else {
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
    else {
        next();
    }
};
exports.errorHandler = errorHandler;
