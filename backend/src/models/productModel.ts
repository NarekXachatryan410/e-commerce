import { Schema, model } from "mongoose";
import { type IProduct } from "../types/productType";

const productSchema = new Schema<IProduct>({
    title: String,
    description: String,
    price: Number,
    image: String,
    userId: {
        type: Schema.Types.ObjectId,
        ref: "User"
    },
    category: String
})

export const Product = model("Product", productSchema)