import mongoose from "mongoose";

import { DB_NAME } from "../constants.js";

const connectDb = async () => {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)
        console.log(`DB host: ${connectionInstance.connection.host}`)
    } catch(err) {
        console.log("connection error is:", err)
        process.exit(1); // It means that stop the node process because of failure - something went wrong
    }
}

export default connectDb;