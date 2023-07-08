import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as redis from "redis";
import UserDB, { User } from '../models/user';
import bcrypt from 'bcrypt';
import upload from '../storage/multer';
import multer from 'multer';
import { authenticate, authenticateAdmin } from '../middleware/auth';
dotenv.config();
const router = express.Router();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
redisClient.connect();

router.post('/token', authenticate, async (req, res) => {
    let token: string = req.body.token;
    if (token == null) return res.status(400).json({ message: "No authentication token found" });

    let user: User;

    try {
        let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
        user = decoded as User;
    } catch {
        try {
            let decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET as string);
            user = decoded as User;
        } catch {
            return res.status(401).json({ message: "Not a valid refresh token" });
        }
    }

    try {
        let redisToken: string = await redisClient.GET(user.username) as string;

        if (redisToken !== token) {
            return res.status(401).json({ message: "This refresh token does not belong to this user" });
        }

        let newToken: string = generateAccessToken(user);
        return res.status(201).json({ accessToken: newToken });

    } catch (error) {
        return res.status(404).json({ message: "This user has not been logged in. Please login first" });
    }
})

router.delete('/logout', authenticate, async (req, res) => {
    let token: string = req.body.token;
    if (!token) return res.status(400).json({ message: "No token found. Please provide a valid Refresh token." });

    let user: User;

    try {
        let decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string);
        user = decoded as User;
    } catch {
        try {
            let decoded = jwt.verify(token, process.env.ADMIN_TOKEN_SECRET as string);
            user = decoded as User
        } catch {
            return res.status(401).json({ message: "Not a valid token" });
        }
    }

    console.log(4);
    try {
        let redisToken: string = await redisClient.GET(user.username) as string;

        if (token !== redisToken) return res.status(401).json({ message: "This token does not exist for the user" });
        await redisClient.DEL(user.username);
        return res.status(200).json({ message: "User logged out successfully" });
    } catch {
        return res.status(404).json({ message: "No such user has been logged in" });
    }
})

router.post("/login", async (req: Request, res: Response) => {
    const {
        username,
        password
    } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username or Password missing." });
    }

    let user: User;



    try {
        let queryUser = await UserDB.findOne({ username: username });
        if (!queryUser) {
            return res.status(404).json({ message: "User not found" });
        }
        user = queryUser?.toObject() as User;
    } catch {
        return res.status(404).json({ message: "User not found" });
    }

    try {
        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Incorrect password for user" });
        }
    } catch {
        return res.status(401).json({ message: "Incorrect password for user" });
    }

    try {
        let accessToken: string = generateAccessToken(user);
        let secret: string = user.role === 'admin' ? process.env.ADMIN_TOKEN_SECRET as string : process.env.REFRESH_TOKEN_SECRET as string;
        let refreshToken: string = jwt.sign(user, secret);

        await redisClient.setEx(user.username, Number(process.env.REFRESH_EXPIRATION), refreshToken);
        res.status(201).json({
            message: "Successfully logged in",
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch {
        res.status(500).json({ message: "An error occured while generating token. Try again..." });
    }
});

router.post("/register", upload.fields([{ name: "picture" }]), async (req: Request, res: Response) => {
    let parsed: any;
    try {
        parsed = JSON.parse(req.body.json);
    } catch {
        return res.status(500).json({ message: "There was a problem with parsing sent data" });
    }

    const {
        username,
        email,
        password,
        picturePath,
    } = parsed;

    if (!(username && email && password && picturePath)) {
        return res.status(400).json({ message: "All fields are required. Try again..." });
    }

    let user: User;

    try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        user = {
            username: username,
            email: email,
            password: hash,
            picturePath: picturePath,
            role: "user",
            completedLessons: [],
            completedSubjects: [],
            completedTests: [],
            subjects: []
        } as User;
    } catch {
        return res.status(500).json({ message: "Error hashing password. Try again..." });
    }

    let userDB;
    try {
        userDB = new UserDB({
            username: user.username,
            email: user.email,
            password: user.password,
            picturePath: user.picturePath,
            role: user.role,
            completedLessons: [],
            completedSubjects: [],
            completedTests: [],
            subjects: []
        });
        await userDB.save();
    } catch {
        return res.status(500).json({ message: "Error occured while saving new user. Try again..." });
    }

    try {
        let accessToken: string = generateAccessToken(user);
        let secret: string = process.env.REFRESH_TOKEN_SECRET as string;
        let refreshToken: string = jwt.sign(user, secret);

        await redisClient.setEx(user.username, Number(process.env.REFRESH_EXPIRATION), refreshToken);
        res.status(201).json({
            message: "Successfully registered user",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userDB.toObject() as User
        });
    } catch {
        res.status(500).json({ message: "An error occured while generating token. Try again..." });
    }
});

router.post("/create", authenticateAdmin, upload.fields([{ name: "picture" }]), async (req: Request, res: Response) => {
    let parsed: any;
    try {
        parsed = JSON.parse(req.body.json);
    } catch {
        return res.status(500).json({ message: "There was a problem with parsing sent data" });
    }

    const {
        username,
        email,
        password,
        role,
        picturePath,
    } = parsed;

    if (!(username && email && password && picturePath && role) && (role !== 'admin' || role !== 'user')) {
        return res.status(400).json({ message: "All fields are required. Try again..." });
    }

    let user: User;

    try {
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        user = {
            username: username,
            email: email,
            password: hash,
            picturePath: picturePath,
            role: role,
            completedLessons: [],
            completedSubjects: [],
            completedTests: [],
            subjects: []
        } as User;
    } catch {
        return res.status(500).json({ message: "Error hashing password. Try again..." });
    }

    let userDB;
    try {
        userDB = new UserDB({
            username: user.username,
            email: user.email,
            password: user.password,
            picturePath: user.picturePath,
            role: user.role,
            completedLessons: [],
            completedSubjects: [],
            completedTests: [],
            subjects: []
        });
        await userDB.save();
    } catch {
        return res.status(500).json({ message: "Error occured while saving new user. Try again..." });
    }

    try {
        let accessToken: string = generateAccessToken(user);
        let secret: string = user.role === 'admin' ? process.env.ADMIN_TOKEN_SECRET as string : process.env.REFRESH_TOKEN_SECRET as string;
        let refreshToken: string = jwt.sign(user, secret);

        await redisClient.setEx(user.username, Number(process.env.REFRESH_EXPIRATION), refreshToken);
        res.status(201).json({
            message: "Successfully registered user",
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: userDB.toObject() as User
        });
    } catch {
        res.status(500).json({ message: "An error occured while generating token. Try again..." });
    }
});

export const generateAccessToken = (user: User) => {
    let token: string = process.env.ACCESS_TOKEN_SECRET as string;
    let options = {
        expiresIn: process.env.TOKEN_EXPIRATION
    };
    return jwt.sign({ user }, token, options);
}

export const extract = (req: Request) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) throw new Error();

    let user: User;

    try {
        let decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string);
        user = decoded as User;
        return user;
    } catch {
        throw new Error();
    }
}
export default router;