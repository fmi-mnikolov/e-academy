import mongoose from "mongoose";

const LessonSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 5,
            max: 50
        },
        subjectId: {
            type: String,
        },
        tests: {
            type: Array<String>,
            default: []
        }
    },
    {
        timestamps: true
    }
);

const LessonDB = mongoose.model("Lesson", LessonSchema);

export default LessonDB;

export interface Lesson {
    _id: String,
    name: String,
    subjectId: String,
    Tests: String[]
}