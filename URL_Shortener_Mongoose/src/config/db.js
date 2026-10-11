import mongoose from "mongoose";
import { env } from "./env.js";

export const connectDB = async() => {
    try {
        await mongoose.connect(env.MONGO_DB_URI)
    } catch (error) {
        console.log(error)
        await mongoose.connection.close()
        process.exit()
    }
}

