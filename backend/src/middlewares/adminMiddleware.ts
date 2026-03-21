import type { NextFunction, Request, Response } from "express";
import { errorResponse } from "../utils/responses";
import { User } from "../models/userModel";

export async function adminMiddleware(req: Request, res: Response, next: NextFunction) {
    const user = await User.findById(req.user?.id).select("role");

    if (!user || user.role !== "admin") {
        return errorResponse(res, "Forbidden", 403);
    }

    next();
}
