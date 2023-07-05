import dotenv from 'dotenv';
import express, { Express, Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as redis from "redis";
import UserDB, { User } from '../models/user';
import bcrypt from 'bcrypt';
dotenv.config();
const router = express.Router();

const redisClient = redis.createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});
redisClient.connect();

router.post('/token', (req, res) => {
    try {
        let token = req.body.token;
        if (token == null) return res.sendStatus(401);

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string, (err, user) => {
            if (err) return res.sendStatus(403);
            let tempUser = user as User;
            let resUser: User = { ...user } as User;
            redisClient.GET(resUser.username as string).then(dbtoken => {
                if (token !== dbtoken) return res.sendStatus(403);
                const accessToken: string = generateAccessToken(user)
                res.json({ accessToken: accessToken })
            }).catch(err => {
                return res.sendStatus(403);
            })
        })
    } catch (error) {
        res.status(400).json({ error: "Incorrect credentials" });
    }
})

router.delete('/logout', async (req, res) => {
    try {
        let token = req.body.token;
        if (token == null) return res.sendStatus(401);

        const user: User = await jwt.verify(token, process.env.REFRESH_TOKEN_SECRET as string) as User;
        if (!user) return res.sendStatus(403);
        console.log(user);
        const dbtoken = await redisClient.GET(user.username) as string;
        if (token !== dbtoken) return res.sendStatus(403);
        await redisClient.DEL(user.username as string);
        return res.sendStatus(204);
    } catch (error) {
        res.status(400).json({ error: "Incorrect credentials" });
    }
})

router.post("/login", async (req: Request, res: Response) => {
    try {
        const {
            username,
            password,
        } = req.body;

        const user = await UserDB.findOne({ username: username });
        if (!user) {
            return res.status(400).json({ error: "No user found" });
        }
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ error: "Unnauthorized" });
        }
        const accessToken = generateAccessToken(user.toObject() as User);
        const refreshToken = jwt.sign(user.toObject(), process.env.REFRESH_TOKEN_SECRET as string);
        await redisClient.setEx(username, 2 * 60 * 60, refreshToken);
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken
        });
    } catch (error) {
        res.status(500).json({ error: error });
    }
});

router.post("/register", async (req: Request, res: Response) => {
    try {
        const {
            username,
            email,
            password,
            picturePath,
        } = req.body;

        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(password, salt);
        const user: User = {
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

        const userDB = new UserDB({
            username: username,
            email: email,
            password: hash,
            picturePath: picturePath,
            role: "user",
            completedLessons: [],
            completedSubjects: [],
            completedTests: [],
            subjects: []
        });
        await userDB.save();
        const accessToken = generateAccessToken(user);
        let refreshToken = jwt.sign(userDB.toObject(), process.env.REFRESH_TOKEN_SECRET as string);
        redisClient.setEx(username, 2 * 60 * 60, refreshToken);
        res.json({
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: user
        });
    } catch (error) {
        res.status(400).json({ error: "Unnauthorize" });
    }
});

function generateAccessToken(user: User) {
    let token: string = process.env.ACCESS_TOKEN_SECRET as string;
    let options = {
        expiresIn: process.env.TOKEN_EXPIRATION
    };
    return jwt.sign({ user }, token, options);
}

export default router;