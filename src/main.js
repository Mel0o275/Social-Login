import express from 'express';
import { globalErrorHandler } from './Middleware/error.middleware.js';
import { PORT } from './Config/config.js';
import { authController, userController } from './Modules/index.js';
import { connectDB } from './DB/connection.db.js';
import jwt from 'jsonwebtoken';
import {randomUUID} from "crypto"
import cors from "cors"

await connectDB()

const app = express();
app.use(express.json(),
    cors({
        origin: "http://localhost:5173",
        credentials: true
    })
);

app.use("/auth", authController)
app.use("/user", userController)


// -------------------------------------------------


// -------------------------------------------------
app.all('/*dummy', (req, res) => {
    console.log("req not found");
})

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on port :: ${PORT}`);
})