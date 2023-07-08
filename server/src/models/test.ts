import mongoose from "mongoose";

const TestSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 2,
            max: 50,
        },
        lessonId: {
            type: String
        },
        question: {
            type: String,
            min: 10,
            max: 100
        },
        answer: {
            type: String,
            min: 10,
            max: 50
        },
    },
    { timestamps: true }
);

const TestDB = mongoose.model("Test", TestSchema);
export default TestDB;

export interface Test {
    _id?: string,
    name: string,
    lessonId: string,
    question: string,
    answer: string
}