import dotenv from "dotenv"
import connectDB from "./dbconnect/dbconn.js";


dotenv.config({path:'./env'})
connectDB()