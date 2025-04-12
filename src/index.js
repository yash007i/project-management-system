import app from "./app.js";
import dotenv from "dotenv";
import express, { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./db/index.js";

dotenv.config({
    path : "./.env",
});
const PORT = process.env.PORT || 9090;
app.use(express.json());
app.use(urlencoded({
    extended: true
}));
app.use(cors({
        origin:`localhost:${PORT}`,
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
);

app.use(cookieParser());

connectDB()
    .then(() => {
        app.listen(PORT , () => {
            console.log(`Server is running on PORT : ${PORT}.`);
            
        })
    })


