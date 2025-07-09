import express from "express";
import { urlencoded } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(
  urlencoded({
    extended: true,
  }),
);
app.use(
  cors({
    origin: `localhost:${process.env.PORT}`,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);

app.use(cookieParser());
// Router import
import healthCheckRouter from "./routes/healthcheck.routes.js";
import userRouter from "../src/routes/user.routes.js";
import noteRouter from "../src/routes/note.routes.js";
import projectRouter from "../src/routes/project.routes.js";
import taskRouter from "../src/routes/task.routes.js";

app.use("/api/v1/health-check", healthCheckRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/notes", noteRouter);
app.use("/api/v1/projects", projectRouter);
app.use("/api/v1/task", taskRouter);
export default app;
