import type { Request, Response } from "express";
import { Order } from "../models/orderModel";
import { Cart } from "../models/cartModel";
import { errorResponse, successResponse } from "../utils/responses";

class OrderController {
    async createOrder(req: Request, res: Response) {
        try {
            const cart = await Cart.findOne({ userId: req.user.id });

            if (!cart || cart.items.length === 0) {
                return errorResponse(res, "Cart is empty");
            }

            const orderItems = cart.items.map((item) => ({
                productId: item.productId,
                title: item.title,
                price: item.price,
                image: item.image,
                quantity: item.quantity
            }));

            const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            const order = await Order.create({
                userId: req.user.id,
                items: orderItems,
                totalPrice,
                status: "pending"
            });

            cart.items = [] as any;
            await cart.save();

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

    async getAllOrders(req: Request, res: Response) {
        try {
            const orders = await Order.find()
                .populate("userId", "username role")
                .sort({ createdAt: -1 });

            return successResponse(res, orders);
        } catch (error) {
            console.error("Error fetching all orders:", error);
            return errorResponse(res, "Failed to fetch orders");
        }
    }

    async completeOrder(req: Request, res: Response) {
        try {
            const { orderId } = req.params;
            const order = await Order.findById(orderId);

            if (!order) {
                return errorResponse(res, "Order not found", 404);
            }

            order.status = "completed";
            await order.save();

            return successResponse(res, order);
        } catch (error) {
            console.error("Error completing order:", error);
            return errorResponse(res, "Failed to complete order");
        }
    }
}

export default new OrderController();
