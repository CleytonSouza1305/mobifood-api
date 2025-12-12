import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { addItemToCart, getCart, updateItemOnCart } from '../controllers/cart-controller'

const cartRouter = express.Router()

cartRouter.get('/cart/:id', authMiddleware, getCart)
cartRouter.post('/cart', authMiddleware, addItemToCart)
cartRouter.put('/cart', authMiddleware, updateItemOnCart)

export default cartRouter