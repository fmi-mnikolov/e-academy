export class Lesson {
    name: string = ""
    content: Component[] = []
    tests: string[] = []
    subjectId: string = '';
    _id?: string = "";
}

export class Component {
    type: string = ""
    value: string = ""
}

export enum ComponentType {
    TITLE,
    DESCRIPTION,
    TEXT,
    IMAGE,
    VIDEO,
    CODE
};