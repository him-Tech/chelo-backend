import ConnectDB from "./config/db.js";
import app from './app.js'
import dotenv from 'dotenv';
import cors from "cors";
import { cloudinaryConnect } from "./config/cloudinary.js";
import fileUpload from "express-fileupload";

// Handling Uncaught Exception
process.on('uncaughtException', (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting server due to uncaught exception`);
  process.exit(1);
});

// Config
dotenv.config();

// Connect to MongoDB
ConnectDB();

// PORT
const PORT = process.env.PORT || 5000;

cloudinaryConnect();

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

// Middleware for file upload
app.use(fileUpload({
  useTempFiles : true,
  tempFileDir : '/tmp/'
}));

// Firing server
const server = app.listen(PORT, () => {
  console.log(`Server is Running ${process.env.DEV_MODE} mode on port ${PORT}`);
});

// Unhandled Promise Rejection
process.on('unhandledRejection', err => {
  console.log(`Error: ${err.message}`);
  console.log(`Shuting down the server due to unhandled Rejection`);
  server.close(() => {
    process.exit(1);
  })
});
