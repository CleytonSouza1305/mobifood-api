import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { paymentByUser } from '../controllers/payment-controller'
const paymentRouter = express.Router()

paymentRouter.get('/payment/:userId', authMiddleware, paymentByUser)

export default paymentRouter