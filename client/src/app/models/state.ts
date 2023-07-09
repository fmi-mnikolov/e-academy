export class State {
    user?: User = undefined;
    accessToken?: string = undefined;
    refreshToken?: string = undefined;
}

export class User {
    username: string = "";
    password: string = "";
    email: string = "";
    role: string = "";
    picturePath: string = ""
    _id: string = "";
    subjects: string[] = [];
    completedSubjects: string[] = [];
    completedLessons: string[] = [];
    completedTests: string[] = [];
}