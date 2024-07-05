import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}${process.env.DB_NAME}`
    );
    console.log(
      `DataBase connection successfull: ${connectionInstance.connection.host}`
    );
  } catch (err) {
    console.error("Unable to connect to the database:", err.message);
  }
};

export default connectDB;
