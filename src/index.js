import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./db/index.js";

dotenv.config();
const PORT = process.env.PORT || 9090;
connectDB()
    .then(() => {
        app.listen(PORT , () => {
            console.log(`Server is running on PORT : ${PORT}.`);
            
        })
    })


