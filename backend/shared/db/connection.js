import mongoose from "mongoose";
export const createConnection = async () => {
  try {
    const result = await mongoose.connect(
      process.env.DB_URL || "mongodb+srv://samarlamba65_db_user:JZ5DCMMtVZdH7KA8@cluster0.poxl3ek.mongodb.net/?appName=Cluster0"
    );
    console.log("db connection is done ");
    return result;
  } catch (err) {
    console.log("db connection is fail");
    throw err;
  }
};
