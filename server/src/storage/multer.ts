import multer from "multer";
import { Request } from 'express';
import { mkdir } from "fs";

const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const dir = './uploads'
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage });

export default upload;