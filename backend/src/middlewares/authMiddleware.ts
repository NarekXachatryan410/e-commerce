import type { Response, Request, NextFunction } from "express"
import { errorResponse } from "../utils/responses"
import jwt from "jsonwebtoken"
import { env } from "../config/env"

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token

    if(!token) {
        return errorResponse(res, "Unathorized", 403)
    }

    try {
        const user = jwt.verify(token, env.JWT_SECRET)
        req.user = user
        next()
    } catch (error) {
        return errorResponse(res, "Unathorized or invalid token", 403)
    }
}