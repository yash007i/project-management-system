import express from "express"
import { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(urlencoded({
    extended: true
}));
app.use(cors({
        origin:`localhost:${process.env.PORT}`,
        methods:['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization']
      })
);

app.use(cookieParser());
// Router import
import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "../src/routes/user.routes.js"

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/users",userRouter)
export default app;