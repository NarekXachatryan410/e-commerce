import { Router } from "express";
import cartController from "../controllers/cartController";
import { authMiddleware } from "../middlewares/authMiddleware";

const cartRouter = Router();

cartRouter.use(authMiddleware);
cartRouter.get("/my", cartController.getMyCart);
cartRouter.post("/items", cartController.addToCart);
cartRouter.delete("/items/:productId", cartController.removeFromCart);

export { cartRouter };
