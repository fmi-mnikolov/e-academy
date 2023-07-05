import express, { Express, NextFunction, Request, Response } from "express";
import dotenv from "dotenv";
import { APIRequest } from "./models/request";
import bodyParser from 'body-parser';
import mongoose, { ConnectOptions } from 'mongoose';
import cors from 'cors';
import multer from 'multer';
import helmet from 'helmet';
import morgan from 'morgan';
import { authenticate } from "./middleware/auth";
import router from "./auth/auth-server";
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

/* FILE STORAGE */
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/assets");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

app.use(express.json());
app.use("/auth", router);

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