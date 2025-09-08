import dotenv from 'dotenv'
import cors from 'cors'
import express from 'express'
import { errorHandler } from './middleware/error-handler'

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())
app.use(errorHandler)

const PORT = process.env.PORT || 1000

app.listen(PORT, () => console.log(`Aplicação rodando na porta: ${PORT}`))