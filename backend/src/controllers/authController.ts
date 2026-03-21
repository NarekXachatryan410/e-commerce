import { errorResponse, successResponse} from "../utils/responses"
import type { Response, Request } from "express"
import { User } from "../models/userModel"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { env } from "../config/env"

class AuthController {
    async signup(req: Request, res: Response) {
        const { username, password } = req.body

        if (!username || !password) {
            return errorResponse(res, "username and password are required")
        }

        const existingUser = await User.findOne({ username })
        if (existingUser) {
            return errorResponse(res, "Username already exists", 409)
        }

        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            username: username.trim(),
            password: hashedPassword,
            role: "user"
        })

        return successResponse(res, {
            message: "Signed up successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        }, 201)
    }

    async login(req: Request, res: Response) {
        const { username, password } = req.body
        if(!username || !password) {
            return errorResponse(res, "username and password are required")
        }

        const user = await User.findOne({username})
        if(!user) {
            return errorResponse(res, "Invalid credentials", 404)
        } 

        const isCorrect = await bcrypt.compare(password, user.password)
        if(!isCorrect) {
            return errorResponse(res, "Invalid credentials")
        }

        const token = jwt.sign({id: user._id, username: user.username}, env.JWT_SECRET, { expiresIn: "3h" })

        res.cookie("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/"
        });

        return successResponse(res, {
            message: "Logged in successfully",
            user: {
                id: user._id,
                username: user.username,
                role: user.role
            }
        }, 201)
    }

    async me(req: Request, res: Response) {
        const { id } = req.user
        const user = await User.findById(id).select("-password")
        if(!user) {
            return errorResponse(res, "User Not Found", 404)
        }
        return successResponse(res, user)
    }

    logout(req: Request, res: Response) {
        res.clearCookie("token", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            path: "/"
        })

        return successResponse(res, "Logged out successfully")
    }
}

export default new AuthController()
