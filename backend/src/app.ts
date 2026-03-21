import express from "express"
import cookieParser from "cookie-parser"
import { connectToDb } from "./db/connection"
import cors from "cors"
import { authRouter } from "./routes/authRoutes"
import { productRouter } from "./routes/productRoutes"
import { orderRouter } from "./routes/orderRoutes"
import { cartRouter } from "./routes/cartRoutes"
import { env } from "./config/env"
import path from "path"

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
app.use(cors({
    origin: env.FRONTEND_URL || "http://localhost:5173",
    credentials: true
}))

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

app.use('/auth', authRouter)
app.use('/products', productRouter)
app.use('/orders', orderRouter)
app.use('/cart', cartRouter)
connectToDb()

app.listen(env.PORT, () => console.log(`URL: http://localhost:${env.PORT}`))
