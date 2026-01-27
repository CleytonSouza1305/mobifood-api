import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { createOrder, orderById, ordersByUserId } from '../controllers/order-controller'

const orderRouter = express.Router()

orderRouter.get('/order/user/:id', authMiddleware, ordersByUserId)
orderRouter.post('/order', authMiddleware, createOrder)
orderRouter.get('/order/:id', authMiddleware, orderById)

export default orderRouter