import express from 'express';
import { authenticate, authenticateAdmin } from '../middleware/auth';
import SubjectDB, { Subject } from '../models/subject';
import upload from '../storage/multer';
import LessonDB from '../models/lesson';
import TestDB from '../models/test';

const router = express.Router();

//GET
router.get("/", authenticate, async (req, res) => {
    try {
        let subjects = await SubjectDB.find();
        if (!subjects) {
            return res.status(400).json({ message: "Not found" });
        }

        const resSubjects = subjects.map(s => s.toObject() as Subject);;
        res.status(200).json(resSubjects);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

router.get("/:subjectId", authenticate, async (req, res) => {
    try {
        const { lessonId: subjectId } = req.params;
        let subject = await SubjectDB.findOne({ _id: subjectId });

        if (!subject) {
            res.status(400).json({ message: "Not found" });
        }

        const resSubject = subject?.toObject() as Subject;
        res.status(200).json(subject);
    } catch (error) {
        res.status(400).json({ message: "Not found" });
    }
})

//POST

router.post("/", authenticateAdmin, upload.fields([{ name: "picture" }]), async (req, res) => {
    try {
        const { name, picture } = req.body;
        let subject = new SubjectDB({
            name: name,
            lessons: [],
            picture: picture
        });
        subject.save();

        res.status(200).json(subject.toObject() as Subject);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

//PUT
router.put("/:id", authenticateAdmin, upload.fields([{ name: "picture" }]), async (req, res) => {
    try {
        const { name, picture } = req.body;
        const { id } = req.params;
        await SubjectDB.updateOne({ _id: id }, {
            name: name,
            lessons: [],
            picture: picture
        });

        let subject: Subject = (await SubjectDB.findById(id))!.toObject() as Subject;

        res.status(200).json(subject);
    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})


//DELETE

router.delete("/", authenticateAdmin, async (req, res) => {
    try {
        await SubjectDB.deleteMany();
        await LessonDB.deleteMany();
        await TestDB.deleteMany();
        res.status(200);
    } catch {
        res.status(500).json({ message: "Unable to delete all subjects" });
    }
});

router.delete("/:subjectId", authenticateAdmin, async (req, res) => {
    try {
        const { subjectId } = req.params;
        let subject = await SubjectDB.findOneAndDelete({ _id: subjectId });
        if (!subject) {
            return res.status(400).json({ message: "Not found" });
        }

        res.status(200);

    } catch (error) {
        res.status(400).json({ message: "Not found" })
    }
})

export default router;