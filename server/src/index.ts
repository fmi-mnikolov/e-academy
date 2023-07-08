import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { APIRequest } from "./models/request";
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { authenticate } from "./middleware/auth";
import authRouter from "./auth/auth-server";
import userRouter from "./routes/user";
import lessonRouter from './routes/lesson';
import subjectRouter from './routes/subject';
dotenv.config();

/* CONFIGURATION */
dotenv.config();
const port = process.env.PORT || 6000;
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ "policy": "cross-origin" }));
app.use(morgan("common"));
app.use(bodyParser.json({ limit: "30mb" }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());
app.use("/assets", express.static('public/assets'));

app.use(express.json());
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/lessons", lessonRouter);
app.use("/subjects", subjectRouter);


app.get("/", authenticate, (req: APIRequest, res: Response) => {
    return res.json(req.user);
})

mongoose.connect(process.env.MONGO_URL as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
} as ConnectOptions).then(() => {
    app.listen(port, () => {
        console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
    })
});