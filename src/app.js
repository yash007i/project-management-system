import express from "express"

const app = express()

// Router import
import healthCheckRouter from "./routes/healthcheck.routes.js"

app.use("api/v1/health-check", healthCheckRouter);

export default app;