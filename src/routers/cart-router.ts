import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { getCart } from '../controllers/cart-controller'

const cartRouter = express.Router()

cartRouter.get('/cart/:id', authMiddleware, getCart)
cartRouter.post('/cart/add', authMiddleware)

export default cartRouter