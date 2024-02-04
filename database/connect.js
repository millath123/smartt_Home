import mongoose from "mongoose";
import dotenv from "dotenv";

const connect = async () => {  
    try {
        dotenv.config();
        const MONGODB_URI = process.env.MONGODB_URI
        const connetion = await mongoose.connect(MONGODB_URI)
        console.log(`MongoDB Connected: ${connetion.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
    }
}

export default connect;
