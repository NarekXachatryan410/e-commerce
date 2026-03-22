import type { Request, Response } from "express";
import { Product } from "../models/productModel";
import { successResponse, errorResponse } from "../utils/responses";

class ProductController {
    async createProduct(req: Request, res: Response) {
        try {
            const { title, description, price, category } = req.body;
            const image = req.file;

            // Validation
            if (!title || !description || !price || !category) {
                return errorResponse(res, "Title, description, price, and category are required");
            }

            if (!image) {
                return errorResponse(res, "Image is required");
            }

            // Create product
            const product = new Product({
                title: title.trim(),
                description: description.trim(),
                price: parseFloat(price),
                category: category.trim(),
                image: `/uploads/${image.filename}`,
                userId: req.user.id
            });

            const savedProduct = await product.save();

            return successResponse(res, {
                id: savedProduct._id,
                title: savedProduct.title,
                description: savedProduct.description,
                price: savedProduct.price,
                image: savedProduct.image,
                category: savedProduct.category
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

    async deleteProduct(req: Request, res: Response) {
        try {
            const { productId } = req.params;
            const deletedProduct = await Product.findByIdAndDelete(productId);

            if (!deletedProduct) {
                return errorResponse(res, "Product not found", 404);
            }

            return successResponse(res, { message: "Product deleted successfully" });
        } catch (error) {
            console.error("Error deleting product:", error);
            return errorResponse(res, "Failed to delete product");
        }
    }
}

export default new ProductController();
