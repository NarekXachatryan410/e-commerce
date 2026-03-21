import { hash } from "bcrypt";
import { User } from "./models/userModel";
import { env } from "./config/env";
import { connectToDb, disconnectFromDb } from "./db/connection";

export async function createAdmin() {
    await connectToDb()
    const hashed = await hash(env.ADMIN_PASSWORD, 10)

    await User.create({
        username: "admin",
        password: hashed,
        role: "admin"
    })

    console.log("admin created")
    await disconnectFromDb()
};

(async () => {
    await createAdmin()
})()