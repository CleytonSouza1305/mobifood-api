import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { createOrder, orderByNumber, ordersByUserId } from '../controllers/order-controller'

const orderRouter = express.Router()

orderRouter.get('/order/user/:id', authMiddleware, ordersByUserId)
orderRouter.post('/order', authMiddleware, createOrder)
orderRouter.get('/order/:orderNumber', authMiddleware, orderByNumber)

export default orderRouter