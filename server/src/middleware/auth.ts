import { NextFunction, Response } from "express";
import { APIRequest } from "../models/request";
import jwt from 'jsonwebtoken';

export const authenticate = (req: APIRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user as string;
        next();
    })
}