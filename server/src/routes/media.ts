import { Response } from 'express-zip';
import express from 'express';
import { authenticate } from '../middleware/auth';

const router = express.Router();

router.post("/user", authenticate, async (req, res) => {
    const { picturePath } = req.body;

    res.status(200).sendFile(`/uploads/users/${picturePath}`, { root: "./" });
})

router.post("/subject", authenticate, async (req, res) => {
    const { picture } = req.body;

    res.status(200).sendFile(`/uploads/subjects/${picture}`, { root: "./" });
})

router.post("/lesson", authenticate, async (req, res) => {
    const { picture } = req.body;
    res.status(200).sendFile(`/uploads/lesson/${picture}`, { root: "./" });
});

export default router;