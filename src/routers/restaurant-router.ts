import express from 'express'
import { authMiddleware } from '../middleware/auth-user'
import { allRestaurants, commentRestaurantReq, restaurantById } from '../controllers/restaurant-controller'

const restaurantRouters = express.Router()

restaurantRouters.get('/restaurants', authMiddleware, allRestaurants)
restaurantRouters.get('/restaurants/:id', authMiddleware, restaurantById)
restaurantRouters.post('/restaurant/:id/comment/:userId', authMiddleware, commentRestaurantReq)

export default restaurantRouters