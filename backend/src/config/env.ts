import dotenv from "dotenv"
import { IEnv } from "../types/envType"
dotenv.config()

const env: IEnv = {
    PORT: process.env.PORT || 4002,
    MONGO_URL: process.env.MONGO_URL || "",
    ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || "",
    JWT_SECRET: process.env.JWT_SECRET || "",
    FRONTEND_URL: process.env.FRONTEND_URL || ""
}

export { env }