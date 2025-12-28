import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { allCoupons, createCoupon } from '../controllers/coupon-controllers'

const couponRouter = express.Router()

couponRouter.get('/coupons', authMiddleware, allCoupons)
couponRouter.post('/coupons', authMiddleware, createCoupon)

export default couponRouter