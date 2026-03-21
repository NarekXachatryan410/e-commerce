import { Schema, model } from "mongoose";
import { IUser } from "../types/userType";

const userSchema = new Schema<IUser>({
    username: {
        type: String,
    },
    role: {
        type: String,
    },
    password: String
})

export const User = model("User", userSchema)