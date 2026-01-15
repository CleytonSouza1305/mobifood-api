import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { createOrder, ordersByUserId } from '../controllers/order-controller'

const orderRouter = express.Router()

orderRouter.get('/order/user/:id', authMiddleware, ordersByUserId)
orderRouter.post('/order', authMiddleware, createOrder)

export default orderRouter