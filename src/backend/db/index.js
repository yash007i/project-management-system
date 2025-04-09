import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected successfully.");
        // console.log(process);        
    } catch (error) {
        console.error("MongoDb connection failed.", error);
        process.exit(1);        
    }
}

export default connectDB;