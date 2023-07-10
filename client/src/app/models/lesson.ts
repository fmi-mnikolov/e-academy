export class Lesson {
    name: string = ""
    content: ContentComponent[] = []
    tests: string[] = []
    subjectId: string = '';
    _id?: string = "";
}

export class ContentComponent {
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