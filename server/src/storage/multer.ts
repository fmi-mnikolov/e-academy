import multer from "multer";
import { Request } from 'express';
import { mkdir } from "fs";

const storageProfilePictures = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const dir = './uploads/users'
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let parsed: any;
        try {
            parsed = JSON.parse(req.body.json);
        } catch {
            return;
        }

        const {
            username
        } = parsed;
        cb(null, `${username}_${file.originalname}`);
    }
});

const storageSubjectPictures = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        const dir = './uploads/subjects'
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let { name } = req.body.json;
        cb(null, `${name}_${file.originalname}`);
    }
});

const storageLessonPictures = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, cb) => {
        let { name } = req.body.json;
        const dir = `./uploads/lessons/${name}`
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        let { name } = req.body.json;
        cb(null, `${name}_${file.originalname}`);
    }
});

export const uploadProfilePicture = multer({ storage: storageProfilePictures });
export const uploadSubjectPicture = multer({ storage: storageSubjectPictures });
export const uploadLessonPictures = multer({ storage: storageLessonPictures });
