import { Router } from "express";
import authController from "../controllers/authController";
import { authMiddleware } from "../middlewares/authMiddleware";

export const authRouter = Router()

authRouter.post('/signup', authController.signup)
authRouter.post('/login', authController.login)
authRouter.get('/me', authMiddleware, authController.me)
authRouter.post('/logout', authMiddleware, authController.logout)
