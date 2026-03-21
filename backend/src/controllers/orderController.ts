import type { Request, Response } from "express";
import { Product } from "../models/productModel";
import { Order } from "../models/orderModel";
import { errorResponse, successResponse } from "../utils/responses";

class OrderController {
    async createOrder(req: Request, res: Response) {
        try {
            const items = req.body.items;

            if (!Array.isArray(items) || items.length === 0) {
                return errorResponse(res, "Order items are required");
            }

            const normalizedItems = items.reduce((acc: Record<string, number>, item: { productId?: string; quantity?: number }) => {
                if (!item.productId) {
                    return acc;
                }

                const quantity = Number(item.quantity) || 1;
                acc[item.productId] = (acc[item.productId] || 0) + quantity;
                return acc;
            }, {});

            const productIds = Object.keys(normalizedItems);

            if (productIds.length === 0) {
                return errorResponse(res, "Valid order items are required");
            }

            const products = await Product.find({ _id: { $in: productIds } });

            if (products.length !== productIds.length) {
                return errorResponse(res, "Some products were not found", 404);
            }

            const orderItems = products.map((product) => ({
                productId: product._id,
                title: product.title,
                price: product.price,
                image: product.image,
                quantity: normalizedItems[String(product._id)]
            }));

            const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const order = await Order.create({
                userId: req.user.id,
                items: orderItems,
                totalPrice,
                status: "pending"
            });

            return successResponse(res, order, 201);
        } catch (error) {
            console.error("Error creating order:", error);
            return errorResponse(res, "Failed to create order");
        }
    }

    async getMyOrders(req: Request, res: Response) {
        try {
            const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
            return successResponse(res, orders);
        } catch (error) {
            console.error("Error fetching orders:", error);
            return errorResponse(res, "Failed to fetch orders");
        }
    }
}

export default new OrderController();
