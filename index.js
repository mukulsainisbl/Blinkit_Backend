import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import helmet from "helmet";
import connectDB from "./config/connectDB.js";
import userRouter from "./routes/user.route.js";
import categoryRouter from "./routes/category.route.js";
import uploadRouter from "./routes/upload.route.js";
import subCategoryRouter from "./routes/subCategory.route.js";
import productRouter from "./routes/product.route.js";
import cartRouter  from "./routes/cart.route.js";
import addressRouter from "./routes/address.route.js";
import orderRouter from "./routes/order.route.js";
const app = express();
const PORT = process.env.PORT ;

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.FRONTEND_URL, // Ensure FRONTEND_URL is set in your .env
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev")); // Use "dev" for concise colored logs in development
app.use(
  helmet({
    crossOriginResourcePolicy: false, // Allows handling cross-origin resources
  })
);

// Routes
app.get("/", (req, res) => {
  res.send(`Server is running on port ${PORT}`);
});

app.use("/api/user", userRouter);
app.use('/api/category' , categoryRouter)
app.use('/api/file' , uploadRouter) //Image Upload
app.use('/api/subCategory' , subCategoryRouter)
app.use('/api/product' , productRouter)
app.use('/api/cart/' , cartRouter)
app.use('/api/address',addressRouter)
app.use('/api/order' , orderRouter)
// Start Server
app.listen(PORT, async () => {
  try {
    await connectDB();
    console.log(`Server is running on port ${PORT}`);
  } catch (error) {
    console.error("Error connecting to the database:", error.message);
    process.exit(1); // Exit process with failure
  }
});
