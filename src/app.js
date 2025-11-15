import express from "express";
import cors from "cors"
// import cookieParser from "cookie-parser"

const app = express();

app.use(cors({
   origin: process.env.CORS_ORIGIN,
   Credential: true
}));
// First of all we will set our CORS that which frontend we will allow to listen(api calls will be made by our frontend only and not all frontend), Here, we will use app.use for our configuations, Inside it, there is cors and inside cors we have set our configuration, in which we set our origin and this origin is coming from our env and there we will set our frontend link, till now we have written the star, The other thing which we have set that credential is true.

app.use(express.json({limit: "16kb"}));

// We have set that the response we will take will be json type(like the data coming from the form so and so on) and it is maximum of 16kb, body parsers were used before to handle this but in upgraded version of express, no need of this thing.

// there is also multer, which is a third party package which is used to get the file coming in response, it will be discussed later. 

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))
// Sometime the data will come from url, which means we have access some page in the frontend and that page is already requesting a response from the backend, so this thing is handled using urlencoded

app.use(express.static("public"))
// Sometime we need to access the images etc, present in our server then this configuration of static will help in this case.
// app.use(express.cookieParser())
// To safely place the data in users browser and to control it we use this cookie parser. 

// Routes import

import userRouter from "./routes/user.routes.js"

// Routes declartion
app.use("/api/v1/users", userRouter);

// http://localhost:8000/api/v1/users/register


export { app };