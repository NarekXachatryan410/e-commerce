import { Schema, model } from "mongoose";
import type { IOrder } from "../types/orderType";

const orderItemSchema = new Schema(
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
            min: 1
        }
    },
    { _id: false }
);

const orderSchema = new Schema<IOrder>(
    {
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        items: {
            type: [orderItemSchema],
            required: true
        },
        totalPrice: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            default: "pending"
        }
    },
    { timestamps: true }
);

// Supports per-user order history sorted by newest first.
orderSchema.index({ userId: 1, createdAt: -1 });

// Supports admin order listing and future status filtering.
orderSchema.index({ status: 1, createdAt: -1 });

export const Order = model("Order", orderSchema);
