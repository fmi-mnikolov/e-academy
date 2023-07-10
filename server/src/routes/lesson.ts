import LessonDB, { Component, Lesson } from './../models/lesson';
import express from 'express';
import { authenticate, authenticateAdmin } from '../middleware/auth';
import SubjectDB, { Subject } from '../models/subject';
import TestDB from '../models/test';
import { uploadLessonPictures } from '../storage/multer';
import path from 'path';

const router = express.Router();

//GET
router.get("/", authenticateAdmin, async (req, res) => {
    try {
        let lessons: Lesson[] = (await LessonDB.find()).map(q => q.toObject() as Lesson);

        return res.status(200).json(lessons);
    } catch {
        return res.status(500).json({ message: "Could not get lessons" });
    }
})

router.get("/by-subject/:subjectId", authenticate, async (req, res) => {
    try {
        const { subjectId } = req.params;
        let subject = await SubjectDB.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(400).json({ message: "Not found" });
        }

        const resSubject = subject.toObject() as Subject;

        let lessons = await LessonDB.find({ subjectId: subjectId });
        if (!lessons) {
            res.status(400).json({ message: "No lessons found" });
        }


        const resLessons: Lesson[] = lessons.map(lesson => lesson.toObject() as Lesson);
        res.status(200).json(resLessons);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

router.get("/:lessonId", authenticate, async (req, res) => {
    try {
        const { lessonId } = req.params;
        let lesson = await LessonDB.findOne({ _id: lessonId });

        if (!lesson) {
            res.status(400).json({ message: "Not found" });
        }

        const resLesson = lesson?.toObject() as Lesson;
        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ message: "Not found" });
    }
})

//POST
router.post("/:subjectId", authenticateAdmin, uploadLessonPictures.array("files", 100), async (req, res) => {
    try {
        const { subjectId } = req.params;
        const { name, content } = req.body;
        let subject = await SubjectDB.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(400).json({ message: "Subject not found" });
        }

        let newContent = JSON.stringify((JSON.parse(content) as Component[]).map(o => {
            if (o.type === "IMAGE" || o.type === "VIDEO") {
                o.value = `${name}_${path.basename(o.value)}`;
                return o;
            }

            return o;
        }));
        const newLesson = new LessonDB({
            name: name,
            tests: [],
            subjectId: subjectId,
            content: newContent
        });

        await newLesson.save();


        const newLessons = (subject.toObject() as Subject).lessons;
        newLessons.push(newLesson._id.toString() as string);
        SubjectDB.findOneAndUpdate({ _id: subject._id }, { lessons: newLessons });

        res.status(200).json(newLesson.toObject() as Lesson);
    } catch (error) {
        res.status(400).json({ message: "Server error" })
    }
})

//PUT
router.put("/:id", authenticateAdmin, uploadLessonPictures.array("files", 100), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, content } = req.body;

        let newContent = JSON.stringify((JSON.parse(content) as Component[]).map(o => {
            if (o.type === "IMAGE" || o.type === "VIDEO") {
                if (!o.value.includes('/') && !o.value.includes('\\')) {
                    return o;
                }
                o.value = `${name}_${path.basename(o.value)}`;
                return o;
            }

            return o;
        }));
        await LessonDB.updateOne({ _id: id }, {
            name: name,
            content: newContent
        });

        const lesson: Lesson = (await LessonDB.findById(id))?.toObject() as Lesson;
        res.status(200).json(lesson);
    } catch (error) {
        res.status(400).json({ message: "Server error" })
    }
});

//DELETE
router.delete("/", authenticateAdmin, async (req, res) => {
    try {
        await SubjectDB.updateMany({}, { lessons: [] });
        await LessonDB.deleteMany();
        await TestDB.deleteMany();
    } catch {
        return res.status(500).json({ message: "Unable to delete lessons" });
    }
});

router.delete("/by-subject/:subjectId", authenticateAdmin, async (req, res) => {
    try {
        const { subjectId } = req.params;
        let subject = await SubjectDB.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(400).json({ message: "Not found" });
        }

        await LessonDB.deleteMany({
            _id: {
                $in: subject.lessons
            }
        });

        await TestDB.deleteMany({
            lessonId: {
                $in: subject.lessons
            }
        });

        await SubjectDB.updateOne({ _id: subjectId }, {
            lessons: []
        });

        res.status(200);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
});

router.delete("/:lessonId", authenticateAdmin, async (req, res) => {
    try {
        const { lessonId } = req.params;
        const { subjectId } = req.body;
        let subject = await SubjectDB.findOne({ _id: subjectId });
        if (!subject) {
            return res.status(400).json({ message: "Not found" });
        }

        const lesson = await LessonDB.findOneAndDelete({ _id: lessonId });
        if (!lesson) {
            res.status(400).json("Not found");
        }

        const newLessons = (subject.toObject() as Subject).lessons.filter(l => l !== lessonId);
        await SubjectDB.findOneAndUpdate({ _id: subjectId }, { lessons: newLessons });

        await LessonDB.deleteOne({ _id: lessonId });

        await TestDB.deleteMany({
            _id: {
                $in: lesson!.tests
            }
        });

        res.status(200);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
});

export default router;