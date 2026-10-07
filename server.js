import express, { json } from "express";
import authRouter from "./routes/auth.js";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
// import User from "./models/User.js";
// import { hashPassword } from "./utils/auth.utils.js";
// import messageRoute from "./routes/message.route.js";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_CONNECTION_STRING;
mongoose
    .connect(`${MONGODB_URI}`)
    .then(() => {
        console.log("Connected to mongo!");
    })
    .catch((err) => console.log("Error: ", err));

app.get('/', (req, res) => {
    try {
        return res.status(200).json({ "message": "Server is up and running!" });
    } catch (err) {
        return res.sendStatus(400).json({ "message": "Server is up but a problem in request", "error": err });
    }
});

app.use("/api/auth", authRouter);

app.listen(PORT, () => {
    console.log(`Server running on ${process.env.DOMAIN}:${PORT}`);
});
