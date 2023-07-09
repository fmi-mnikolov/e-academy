import LessonDB, { Lesson } from './../models/lesson';
import express from 'express';
import { authenticate, authenticateAdmin } from '../middleware/auth';
import SubjectDB, { Subject } from '../models/subject';
import TestDB, { Test } from '../models/test';

const router = express.Router();

//GET
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        let tests: Test[] = (await TestDB.find()).map(t => t.toObject() as Test);

        return res.status(200).json(tests ? tests : []);
    } catch {
        return res.status(500).json({ message: "Cannot retrieve tests" });
    }
})

router.get("/by-lesson/:lessonId", authenticate, async (req, res) => {
    try {
        const { lessonId } = req.params;
        let lesson = await LessonDB.findOne({ _id: lessonId });
        if (!lesson) {
            return res.status(400).json({ message: "Not found" });
        }

        const resLesson = lesson.toObject() as Lesson;

        let tests = await TestDB.find();
        if (!tests) {
            res.status(400).json({ "message": "No lessons found" });
        }


        const resTests: Test[] = tests.map(t => t.toObject() as Test).filter(t => resLesson?.tests.includes(t._id as string));
        res.status(200).json(resTests);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

router.get("/:testId", authenticate, async (req, res) => {
    try {
        const { testId } = req.params;
        let test = await TestDB.findOne({ _id: testId });

        if (!test) {
            res.status(400).json({ message: "Not found" });
        }

        const resTest = test?.toObject() as Test;
        res.status(200).json(resTest);
    } catch (error) {
        res.status(400).json({ message: "Not found" });
    }
})

//POST
router.post("/:lessonId", async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { name, question, answer } = req.body;
        let lesson = await LessonDB.findOne({ _id: lessonId });
        if (!lesson) {
            return res.status(400).json({ message: "Not found" });
        }

        const newTest = new TestDB({
            name: name,
            quesiton: question,
            answer: answer,
            lessonId: lessonId
        });
        await newTest.save();


        const newTests = (lesson.toObject() as Lesson).tests;
        newTests.push(newTest._id.toString() as string);
        await LessonDB.updateOne({ _id: lesson._id }, { tests: newTests });

        res.status(200).json(newTest.toObject() as Test);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

//PUT
router.put("/:id", authenticateAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        const { name, question, answer } = req.body;
        let test = await TestDB.findOne({ _id: id });
        if (!test) {
            return res.status(400).json({ message: "Not found" });
        }

        await TestDB.updateOne({ _id: id }, {
            name: name,
            quesiton: question,
            answer: answer,
        });

        res.status(200);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

//DELETE
router.delete("/", authenticateAdmin, async (req, res) => {
    try {
        await TestDB.deleteMany();
        await LessonDB.updateMany({}, {
            tests: []
        });

        return res.status(200);
    } catch {
        return res.status(500).json({ message: "Could not delete tests" });
    }
})

router.delete("/by-lesson/:lessonId", async (req, res) => {
    try {
        const { lessonId } = req.params;
        let lesson = await LessonDB.findOne({ _id: lessonId });
        if (!lesson) {
            return res.status(400).json({ message: "Not found" });
        }

        await TestDB.deleteMany({ lessonId: lessonId });
        await LessonDB.updateOne({ _id: lessonId }, { tests: [] });
        res.status(200);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
});

router.delete("/:testId", async (req, res) => {
    try {
        const { testId } = req.params;
        const { lessonId } = req.body;
        let lesson = await LessonDB.findOne({ _id: lessonId });
        if (!lesson) {
            return res.status(400).json({ message: "Not found" });
        }

        await TestDB.deleteOne({ _id: testId });

        const newTests = (lesson.toObject() as Lesson).tests.filter(l => l !== testId);
        await LessonDB.updateOne({ _id: lessonId }, { tests: newTests });
        res.status(200);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

export default router;