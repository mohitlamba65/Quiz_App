import mongoose from "mongoose";

export const createConnection = async () => {
   try {
        const connectionInstance =  await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("\n MongoDB connected successfully ✅ DB HOST: ",connectionInstance.connection.host);
    } catch (error) {
        console.log("MongoDB connection error !!", error);
        process.exit(1);
    }
};
