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
        content: {
            type: String,
            min: 20,
            required: true
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
    _id?: string,
    name: string,
    content: string,
    subjectId: string,
    tests: string[]
}