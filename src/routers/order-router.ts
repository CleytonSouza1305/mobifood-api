import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { ordersByUserId } from '../controllers/order-controller'

const orderRouter = express.Router()

orderRouter.get('/order/user/:id', authMiddleware, ordersByUserId)

export default orderRouter