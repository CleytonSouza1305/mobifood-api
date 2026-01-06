import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { allCoupons, createCoupon, couponUsage, validateCoupon, couponAvaliable } from '../controllers/coupon-controllers'

const couponRouter = express.Router()

couponRouter.get('/coupons', authMiddleware, allCoupons)
couponRouter.get('/coupons/avaliable', authMiddleware, couponAvaliable)
couponRouter.post('/coupons', authMiddleware, createCoupon)
couponRouter.get('/coupons/usage/:userId', authMiddleware, couponUsage)
couponRouter.get('/coupons/:code', authMiddleware, validateCoupon)

export default couponRouter