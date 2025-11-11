// require('dotenv').config({path: "./env"})
// import mongoose from "mongoose";
// import { DB_NAME } from "./constants";
// import express from "express";
import dotenv from "dotenv"
import connectDb from "./db/index.js";
// const app = express();

dotenv.config({
    path: "./.env"
})

connectDb();

// mongoose.connect('mongodb://127.0.0.1:27017/test'); 
// In document, there is a direct line for database connection, but we will not directly connect our database, because whenever we connect our database then problem could arise so always use try catch block to handle the error, and database takes time to connectc so always use try catch block

// After this database connection, you may will have a code in which we have talk about our express, sometime express is unable to talk with database , so its error is handle there in try block, also i have added the listener of the app over there. At the end the code is super clean for database connection with all best practices. 


/*
(async ()=>{
    try {
      await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`); 
      app.on("error",(err)=>{
        console.log("error is:", err)
      })
      app.listen(process.env.PORT,()=>{
        console.log(`Our app is listening on port ${process.env.PORT}`)
      })
    } catch (err) {
        console.log("error is:",err)
    }
    
})()
*/