import { NextFunction, Response } from "express";
import { APIRequest } from "../models/request";
import jwt from 'jsonwebtoken';
import { User } from "../models/user";

export const authenticate = (req: APIRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: "Invalid data was received" });

    let user: User;

    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}


export const authenticateAdmin = (req: APIRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(400).json({ message: "Invalid data was received" });

    let user: User;

    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        user = decoded as User;
        if (user.role !== 'admin') return res.status(401).json({ message: "You are not authorized to make this request" });
        next();
    } catch {
        res.status(401).json({ message: "Invalid token" });
    }
}

