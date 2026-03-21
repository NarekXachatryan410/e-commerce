import express from "express"
import cookieParser from "cookie-parser"
import { env } from "./config/env"
import { connectToDb } from "./db/connection"

const app = express()

app.use(express.json())
app.use(express.urlencoded())
app.use(cookieParser())
connectToDb()

app.listen(env.PORT, () => console.log(`URL: http://localhost:${env.PORT}`))