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

// Supports admin-owned product lookups.
productSchema.index({ userId: 1 });

// Supports category-based product queries if filtering moves server-side.
productSchema.index({ category: 1, title: 1 });

export const Product = model("Product", productSchema)
