import { Router } from "express";
import orderController from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";
import { adminMiddleware } from "../middlewares/adminMiddleware";

const orderRouter = Router();

orderRouter.use(authMiddleware);
orderRouter.get("/", adminMiddleware, orderController.getAllOrders);
orderRouter.patch("/:orderId/complete", adminMiddleware, orderController.completeOrder);
orderRouter.post("/", orderController.createOrder);
orderRouter.get("/my", orderController.getMyOrders);

export { orderRouter };
