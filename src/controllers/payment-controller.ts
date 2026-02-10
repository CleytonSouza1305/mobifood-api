import { Handler } from "express";

const paymentByUser: Handler = async (req, res, next) => {
  try {
    const { userId } = req.params
    const user = await 

  } catch (error) {
    next(error)
  }
}

export { paymentByUser }