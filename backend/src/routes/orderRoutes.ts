import { Router } from "express";
import orderController from "../controllers/orderController";
import { authMiddleware } from "../middlewares/authMiddleware";

const orderRouter = Router();

orderRouter.use(authMiddleware);
orderRouter.post("/", orderController.createOrder);
orderRouter.get("/my", orderController.getMyOrders);

export { orderRouter };
