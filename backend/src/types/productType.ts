import { Document, Types } from "mongoose"

export interface IProduct extends Document {
    title: string
    description: string
    price: number
    image?: string
    userId: Types.ObjectId
    category: string
}