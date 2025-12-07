import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error-handler'
import userRouter from './routers/user-router'
import restaurantRouters from './routers/restaurant-router'
import cartRouter from './routers/cart-router'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/auth', userRouter)
app.use('/api', restaurantRouters)
app.use('/api', cartRouter)
app.use(errorHandler)

const PORT = process.env.PORT || 1000

app.listen(PORT, () => console.log(`Aplicação rodando na porta: ${PORT}`))