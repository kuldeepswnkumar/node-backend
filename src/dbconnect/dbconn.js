import mongoose from "mongoose";
import { DBName } from "../constants.js";

const connectDB = async () => {
    try {
        const dbConnection = await mongoose.connect(`${process.env.DATABASE_URL}/${DBName}`)
        console.log(`Database Connected!! DB Host: ${dbConnection.connection.host}`)
    } catch (error) {
        console.log("Database connection failed!!", error)
        process.exit(1)
    }
}
export default connectDB