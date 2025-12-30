import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { allCoupons, createCoupon, couponUsage } from '../controllers/coupon-controllers'

const couponRouter = express.Router()

couponRouter.get('/coupons', authMiddleware, allCoupons)
couponRouter.post('/coupons', authMiddleware, createCoupon)
couponRouter.get('/coupons/usage/:id', authMiddleware, couponUsage)

export default couponRouter