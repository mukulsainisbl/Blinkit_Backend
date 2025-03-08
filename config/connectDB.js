import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
if(!process.env.MONGO_URI) {
  throw new Error("Please provide a mongo uri");
}
async function connectDB(){
     try {
         await mongoose.connect(process.env.MONGO_URI)
         console.log("Connect DB") 
     } catch (error) {
        console.log("Error connecting to DB", error)
        process.exit(1)
        
     }
}
export default connectDB;