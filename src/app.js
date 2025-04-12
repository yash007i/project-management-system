import express from "express"

const app = express()

// Router import
import healthCheckRouter from "./routes/healthcheck.routes.js"
import userRouter from "../src/routes/user.routes.js"

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/users",userRouter)
export default app;