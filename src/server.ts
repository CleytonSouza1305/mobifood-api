import dotenv from 'dotenv'
import cron from 'node-cron';
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error-handler'
import userRouter from './routers/user-router'
import restaurantRouters from './routers/restaurant-router'
import cartRouter from './routers/cart-router'
import { runWeeklyCouponAutomation } from './utils/generateWeeklyCoupons';
import couponRouter from './routers/coupon-router';
import orderRouter from './routers/order-router';

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', userRouter)
app.use('/api', restaurantRouters)
app.use('/api', cartRouter)
app.use('/api', couponRouter)
app.use('/api', orderRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 1000

app.listen(PORT, () => console.log(`Aplicação rodando na porta: ${PORT}`))

cron.schedule('0 0 * * 0', async () => {
  await runWeeklyCouponAutomation();
});