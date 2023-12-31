import mongoose from "mongoose";

const SubjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            min: 5,
            max: 50
        },
        lessons: {
            type: Array<String>,
            default: []
        },
        picture: {
            type: String
        }
    }
);

const SubjectDB = mongoose.model("Subject", SubjectSchema);

export default SubjectDB;

export interface Subject {
    _id?: string,
    name: string,
    lessons: string[],
    picture: string
}