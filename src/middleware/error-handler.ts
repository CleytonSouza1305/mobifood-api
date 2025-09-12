import { ErrorRequestHandler } from "express";
import { HttpError } from "../error/HttpError"

export const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
  if (error) {
    if (error instanceof HttpError) {
      return res.status(error.status).json({ message: error.message });
    } else {
      return res.status(500).json({ message: error.message || "Internal Server Error" });
    }
  } else {
    next()
  }
}
