import { Document, Types } from "mongoose";

export interface ICartItem {
    productId: Types.ObjectId;
    title: string;
    price: number;
    image?: string;
    quantity: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    items: ICartItem[];
}
