import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { addItemToCart, deleteItemOnCart, getCart, updateItemOnCart } from '../controllers/cart-controller'

const cartRouter = express.Router()

cartRouter.get('/cart/:id', authMiddleware, getCart)
cartRouter.post('/cart', authMiddleware, addItemToCart)
cartRouter.put('/cart/:itemId', authMiddleware, updateItemOnCart)
cartRouter.delete('/cart/:itemId', authMiddleware, deleteItemOnCart)

export default cartRouter