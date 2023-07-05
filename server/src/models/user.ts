import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            min: 2,
            max: 50,
            unique: true
        },
        email: {
            type: String,
            required: true,
            max: 50,
            unique: true,
        },
        role: {
            type: String,
            required: true,
            min: 2,
            max: 50
        },
        password: {
            type: String,
            required: true,
            min: 5,
        },
        picturePath: {
            type: String,
            default: "",
        },
        subjects: {
            type: Array<String>,
            default: [],
        },
        completedSubjects: {
            type: Array<String>,
            default: []
        },
        completedLessons: {
            type: Array<String>,
            default: []
        },
        completedTests: {
            type: Array<String>,
            default: []
        },
    },
    { timestamps: true }
);

const UserDB = mongoose.model("User", UserSchema);
export default UserDB;

export interface User {
    _id?: string,
    username: string,
    email: string,
    password: string,
    role: string,
    picturePath: string,
    subjects: string[],
    completedSubjects: string[],
    completedLessons: string[],
    completedTests: string[]
}