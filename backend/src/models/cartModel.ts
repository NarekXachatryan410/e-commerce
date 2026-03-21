import { Schema, model } from "mongoose";
import type { ICart } from "../types/cartType";

const cartItemSchema = new Schema(
    {
        productId: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: true
        },
        title: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        },
        image: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
            default: 1
        }
    },
    { _id: false }
);

const cartSchema = new Schema<ICart>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true
        },
        items: {
            type: [cartItemSchema],
            default: []
        }
    },
    { timestamps: true }
);

export const Cart = model("Cart", cartSchema);
