import { Document, Types } from "mongoose";

export interface IOrderItem {
    productId: Types.ObjectId;
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

export interface IOrder extends Document {
    userId: Types.ObjectId;
    items: IOrderItem[];
    totalPrice: number;
    status: string;
}
