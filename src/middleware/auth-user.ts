import { Handler } from "express";

export const authMiddleware:Handler = (req, res, next) => {
  try {
    const autorizationHeader = req.headers.authorization
    
    if (autorizationHeader) {
      const token = autorizationHeader.split(' ')[1]

      
    }
  } catch (error) {
    next(error)
  }
}