import dotenv from "dotenv"
import connectDB from "./dbconnect/dbconn.js";
import express from "express";
const app = express();

dotenv.config({path:'./env'})

connectDB()
.then(()=>{
    app.listen(process.env.PORT || 8000, ()=>{
        console.log(`Server running of Port ${process.env.PORT}`);
    })
})
.catch((err) => console.log("Database Connection Failed!!", err))