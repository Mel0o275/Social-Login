import mongoose from "mongoose";
import { MONGO_URI } from "../Config/config.js";

export const connectDB = async() => {
    try {
        await mongoose.connect(MONGO_URI)
        console.log(`DB connected successfully`);
        
    } catch (error) {
        console.log(`DB can't connect`);
        
    }
}