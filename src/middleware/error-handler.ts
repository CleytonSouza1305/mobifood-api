import { ErrorRequestHandler } from "express";
import { HttpError } from "../error/HttpError"

export const errorHandler:ErrorRequestHandler = (error, req, res, next) => {
  if (error) {
    if (error instanceof HttpError) {
      res.status(error.status).json({ message: error.message });
    } else {
      res.status(500).json({ message: "Internal Server Error" });
    }
  } else {
    next()
  }
}
