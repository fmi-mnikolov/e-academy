import { Request, Response, NextFunction } from 'express';
import express from 'express';
import { authenticate, authenticateAdmin } from '../middleware/auth';
import UserDB, { User } from '../models/user';
import { extract } from '../auth/auth-server';
import SubjectDB, { Subject, Subject as Test } from '../models/subject';
import LessonDB, { Lesson } from '../models/lesson';
import TestDB from '../models/test';
import bcrypt from 'bcrypt';


const router = express.Router();
//GET

router.get('/', authenticate, async (req: Request, res: Response) => {
    try {
        const users = await UserDB.find();
        if (!users) {
            return res.status(404).json("No users found");
        }
        const resUsers: User[] = users.map(user => user.toObject() as User);

        return res.status(200).json(users);
    } catch (error) {
        res.status(404).json({ "message": "No users found" });
    }
})

router.get("/:id", authenticate, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await UserDB.findOne({ _id: id });
        if (!user) {
            return res.status(404).json({ message: "No user found" });
        }
        const resUser: User = user!.toObject() as User;

        return res.status(200).json(user);
    } catch (error) {
        return res.status(404).json({ message: "No user found" });
    }
})

router.get('/subjects', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch {
        return res.status(500).json({ message: "Could not validate token" });
    }
    let subjects: Subject[] = [];
    try {
        let queryResult = await SubjectDB.find();
        subjects = queryResult.map(q => q.toObject() as Subject).filter(s => user.subjects.includes(s._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(subjects);
})

router.get('/subjects/:id', authenticateAdmin, async (req: Request, res: Response) => {
    let user: User;
    try {
        const { id } = req.params;
        const queryRes = await UserDB.findOne({ _id: id });
        if (!queryRes) {
            return res.status(404).json({ message: "No user found" });
        }
        user = queryRes!.toObject() as User;
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let subjects: Subject[] = [];
    try {
        let queryResult = await SubjectDB.find();
        subjects = queryResult.map(q => q.toObject() as Subject).filter(s => user.subjects.includes(s._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(subjects);
})

router.get("/completed/subjects/:id", authenticateAdmin, async (req, res) => {
    let user: User;
    try {
        const { id } = req.params;
        const queryRes = await UserDB.findOne({ _id: id });
        if (!queryRes) {
            return res.status(404).json({ message: "No user found" });
        }
        user = queryRes!.toObject() as User;
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let subjects: Subject[] = [];
    try {
        let queryResult = await SubjectDB.find();
        subjects = queryResult.map(q => q.toObject() as Subject).filter(s => user.completedSubjects.includes(s._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(subjects);
});

router.get("/completed/lessons/:id", authenticateAdmin, async (req, res) => {
    let user: User;
    try {
        const { id } = req.params;
        const queryRes = await UserDB.findOne({ _id: id });
        if (!queryRes) {
            return res.status(404).json({ message: "No user found" });
        }
        user = queryRes!.toObject() as User;
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let lessons: Lesson[] = [];
    try {
        let queryResult = await LessonDB.find();
        lessons = queryResult.map(q => q.toObject() as Lesson).filter(l => user.completedLessons.includes(l._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(lessons);
});

router.get("/completed/tests/:id", authenticateAdmin, async (req, res) => {
    let user: User;
    try {
        const { id } = req.params;
        const queryRes = await UserDB.findOne({ _id: id });
        if (!queryRes) {
            return res.status(404).json({ message: "No user found" });
        }
        user = queryRes!.toObject() as User;
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let tests: Test[] = [];
    try {
        let queryResult = await TestDB.find();
        tests = queryResult.map(q => q.toObject() as Test).filter(t => user.subjects.includes(t._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(tests);
});

router.get("/completed/subjects", authenticate, async (req, res) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let subjects: Subject[] = [];
    try {
        let queryResult = await SubjectDB.find();
        subjects = queryResult.map(q => q.toObject() as Subject).filter(s => user.completedSubjects.includes(s._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(subjects);
});

router.get("/completed/lessons", authenticate, async (req, res) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let lessons: Lesson[] = [];
    try {
        let queryResult = await LessonDB.find();
        lessons = queryResult.map(q => q.toObject() as Lesson).filter(l => user.completedSubjects.includes(l._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(lessons);
});

router.get("/completed/tests", authenticate, async (req, res) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let tests: Test[] = [];
    try {
        let queryResult = await TestDB.find();
        tests = queryResult.map(q => q.toObject() as Test).filter(t => user.completedSubjects.includes(t._id as string));
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json(tests);
});

// POST

router.post('/subjects/add/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No subject id found in request" });
    }
    let dbSubject;
    try {
        dbSubject = await SubjectDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such subject exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentSubjects: string[] = dbUser?.toObject().subjects;
    currentSubjects = currentSubjects.concat(id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { subjects: currentSubjects });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        subjects: currentSubjects
    });
})

router.post('/subjects/remove/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No subject id found in request" });
    }
    let dbSubject;
    try {
        dbSubject = await SubjectDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such subject exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentSubjects: string[] = dbUser?.toObject().subjects;
    currentSubjects = currentSubjects.filter(s => s !== id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { subjects: currentSubjects });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        subjects: currentSubjects
    });
})

router.post('/completed/subjects/add/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No lesson id found in request" });
    }
    let dbSubject;
    try {
        dbSubject = await SubjectDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such lesson exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentSubjects: string[] = dbUser?.toObject().completedSubjects;
    currentSubjects = currentSubjects.concat(id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedSUbjects: currentSubjects });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedSubjects: currentSubjects
    });
})

router.post('/completed/subjects/remove/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No lesson id found in request" });
    }
    let dbSubject;
    try {
        dbSubject = await SubjectDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such lesson exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentSubjects: string[] = dbUser?.toObject().completedSubjects;
    currentSubjects = currentSubjects.filter(s => s !== id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedSUbjects: currentSubjects });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedSubjects: currentSubjects
    });
})

router.post('/completed/lessons/add/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No lesson id found in request" });
    }
    let dbLesson;
    try {
        dbLesson = await LessonDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such lesson exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentLessons: string[] = dbUser?.toObject().completedLessons;
    currentLessons = currentLessons.concat(id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedLessons: currentLessons });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedLessons: currentLessons
    });
})

router.post('/completed/lessons/remove/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No lesson id found in request" });
    }
    let dbLesson;
    try {
        dbLesson = await LessonDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such lesson exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentLessons: string[] = dbUser?.toObject().completedLessons;
    currentLessons = currentLessons.filter(l => l !== id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedLessons: currentLessons });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedLessons: currentLessons
    });
})

router.post('/completed/tests/add/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No test id found in request" });
    }
    let dbTest;
    try {
        dbTest = await TestDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such test exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentTests: string[] = dbUser?.toObject().completedTests;
    currentTests = currentTests.concat(id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedTests: currentTests });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedTests: currentTests
    });
})

router.post('/completed/tests/remove/:id', authenticate, async (req: Request, res: Response) => {
    let user: User;
    try {
        user = extract(req);
    } catch (error) {
        res.status(404).json({ message: "No user found" });
    }

    let id: string = '';
    try {
        const { parsed } = req.params;
        id = parsed;
    } catch {
        return res.status(400).json({ message: "No test id found in request" });
    }
    let dbTest;
    try {
        dbTest = await TestDB.findById(id);
    } catch {
        return res.status(404).json({ message: "No such test exists" });
    }

    let dbUser;

    try {
        dbUser = await UserDB.findById(user!._id);
    } catch {
        res.status(404).json({ message: "No such user exists" });
    }

    let currentTests: string[] = dbUser?.toObject().completedTests;
    currentTests = currentTests.filter(t => t !== id);
    try {
        await UserDB.updateOne({ _id: user!._id }, { completedTests: currentTests });
    } catch {
        return res.status(500).json({ message: "Error in executing request" });
    }

    return res.status(200).json({
        ...dbUser.toObject(),
        completedTests: currentTests
    });
})


// PUT
router.put("/:id", authenticateAdmin, async (req, res) => {
    const { id } = req.params;
    const {
        username,
        email,
        password,
        role,
        picturePath
    } = req.body;


    if (!(username && email && password && picturePath && role) && (role !== 'admin' || role !== 'user')) {
        return res.status(400).json({ message: "All fields are required. Try again..." });
    }

    let user;
    try {
        user = await UserDB.findById(id);
        if (!user) return res.status(404).json({ message: "No user found" });
    } catch {
        return res.status(404).json({ message: "No user found" });
    }
    let hash: string = user!.password;
    try {
        let salt: string = await bcrypt.genSalt();
        hash = await bcrypt.hash(password, salt);
    } catch {
        return res.status(500).json({ message: "Error encrypting/decrypting password" });
    }

    try {
        await UserDB.updateOne({ _id: id }, {
            username: username,
            email: email,
            password: hash,
            picturePath: picturePath
        });
    } catch {
        return res.status(500).json({ message: "Error in updating account" });
    }

    try {
        user = await UserDB.findById(id);
    } catch {
        return res.status(500).json({ message: "Error retrieving user" });
    }

    return res.status(200).json(user.toObject() as User);
});

router.put("/", authenticate, async (req, res) => {
    let id: string = "";
    try {
        id = extract(req)._id!;
    } catch {
        return res.status(400).json({ message: "No such user found" });
    }

    const {
        username,
        email,
        password,
        role,
        picturePath
    } = req.body;


    if (!(username && email && password && picturePath && role) && (role !== 'admin' || role !== 'user')) {
        return res.status(400).json({ message: "All fields are required. Try again..." });
    }

    let user;
    try {
        user = await UserDB.findById(id);
        if (!user) return res.status(404).json({ message: "No user found" });
    } catch {
        return res.status(404).json({ message: "No user found" });
    }
    let hash: string = user!.password;
    try {
        let salt: string = await bcrypt.genSalt();
        hash = await bcrypt.hash(password, salt);
    } catch {
        return res.status(500).json({ message: "Error encrypting/decrypting password" });
    }

    try {
        await UserDB.updateOne({ _id: id }, {
            username: username,
            email: email,
            password: hash,
            picturePath: picturePath
        });
    } catch {
        return res.status(500).json({ message: "Error in updating account" });
    }

    try {
        user = await UserDB.findById(id);
    } catch {
        return res.status(500).json({ message: "Error retrieving user" });
    }

    return res.status(200).json(user.toObject() as User);
});

//DELETE
router.delete("/", authenticateAdmin, async (req: Request, res: Response) => {
    try {
        const user = await UserDB.deleteMany();
        if (!user) {
            return res.status(404).json("No user found.");
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ message: "No user found!" });
    }
})

router.delete("/:id", authenticateAdmin, async (req: Request, res: Response) => {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "No id was passed" });

    try {
        const user = await UserDB.findOneAndDelete({ _id: id });
        if (!user) {
            return res.status(404).json("No user found.");
        }
        res.status(200).json(user);

    } catch (error) {
        res.status(404).json({ message: "No user found!" });
    }
})

export default router;