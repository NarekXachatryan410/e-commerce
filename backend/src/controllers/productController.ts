import type { Request, Response } from "express";
import { Product } from "../models/productModel";
import { successResponse, errorResponse } from "../utils/responses";

class ProductController {
    async createProduct(req: Request, res: Response) {
        try {
            const { title, description, price } = req.body;
            const image = req.file;

            // Validation
            if (!title || !description || !price) {
                return errorResponse(res, "Title, description, and price are required");
            }

            if (!image) {
                return errorResponse(res, "Image is required");
            }

            // Create product
            const product = new Product({
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price),
                image: `/uploads/${image.filename}`,
                userId: req.user.id
            });

            const savedProduct = await product.save();

            return successResponse(res, {
                id: savedProduct._id,
                title: savedProduct.title,
                description: savedProduct.description,
                price: savedProduct.price,
                image: savedProduct.image
            }, 201);

        } catch (error) {
            console.error("Error creating product:", error);
            return errorResponse(res, "Failed to create product");
        }
    }

    async getAllProducts(req: Request, res: Response) {
        try {
            const products = await Product.find().populate('userId', 'username');
            return successResponse(res, products);
        } catch (error) {
            console.error("Error fetching products:", error);
            return errorResponse(res, "Failed to fetch products");
        }
    }
}

export default new ProductController();