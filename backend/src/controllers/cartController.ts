import type { Request, Response } from "express";
import { Cart } from "../models/cartModel";
import { Product } from "../models/productModel";
import { errorResponse, successResponse } from "../utils/responses";

class CartController {
    async getMyCart(req: Request, res: Response) {
        try {
            const cart = await Cart.findOne({ userId: req.user.id });

            if (!cart) {
                return successResponse(res, { items: [] });
            }

            return successResponse(res, cart);
        } catch (error) {
            console.error("Error fetching cart:", error);
            return errorResponse(res, "Failed to fetch cart");
        }
    }

    async addToCart(req: Request, res: Response) {
        try {
            const { productId } = req.body;

            if (!productId) {
                return errorResponse(res, "productId is required");
            }

            const product = await Product.findById(productId);
            if (!product) {
                return errorResponse(res, "Product not found", 404);
            }

            let cart = await Cart.findOne({ userId: req.user.id });

            if (!cart) {
                cart = await Cart.create({
                    userId: req.user.id,
                    items: []
                });
            }

            const existingItem = cart.items.find(
                (item) => String(item.productId) === String(product._id)
            );

            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.items.push({
                    productId: product._id,
                    title: product.title,
                    price: product.price,
                    image: product.image,
                    quantity: 1
                } as any);
            }

            await cart.save();

            return successResponse(res, cart);
        } catch (error) {
            console.error("Error adding to cart:", error);
            return errorResponse(res, "Failed to add to cart");
        }
    }

    async removeFromCart(req: Request, res: Response) {
        try {
            const { productId } = req.params;

            const cart = await Cart.findOne({ userId: req.user.id });

            if (!cart) {
                return successResponse(res, { items: [] });
            }

            cart.items = cart.items.filter(
                (item) => String(item.productId) !== String(productId)
            ) as any;

            await cart.save();

            return successResponse(res, cart);
        } catch (error) {
            console.error("Error removing from cart:", error);
            return errorResponse(res, "Failed to remove item from cart");
        }
    }
}

export default new CartController();
