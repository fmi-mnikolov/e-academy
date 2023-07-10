import { Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { ComponentType, ContentComponent, Lesson } from 'src/app/models/lesson';
import { Subject } from 'src/app/models/subject';
import { LessonService } from 'src/app/services/lesson.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-create-lesson',
  templateUrl: './create-lesson.component.html',
  styleUrls: ['./create-lesson.component.css']
})
export class CreateLessonComponent {
  lessonForm: FormGroup;
  files!: File[];
  subjects!: Observable<Subject[]>

  constructor(fb: FormBuilder, private service: LessonService, private subjectService: SubjectService) {
    this.lessonForm = fb.group({
      name: ["", Validators.required],
      content: fb.group({
        value: fb.array<ContentComponent>([])
      }),
      subjectId: ["", Validators.required],
    });
    this.getSubjects();
  }

  getSubjects() {
    this.subjects = this.subjectService.getAllSubjects();
  }

  onSubmit() {
    let lesson = this.lessonForm.value as Lesson;
    this.service.createLesson(this.lessonForm.get("subjectId")?.value, lesson);
  }

  updateContent(event: ContentComponent) {
    let newContent: ContentComponent[] = this.lessonForm.get("content")?.get("value")?.value;
    newContent.push(event);
    this.lessonForm.get("content")?.setValue(newContent);
  }

  updateId(event: Event) {
    this.lessonForm.get("subjectId")?.setValue((event.target as HTMLSelectElement).value)
  }

  updateFiles(event: File) {
    this.files.push(event);
  }

  get content(): ContentComponent[] {
    return this.lessonForm.get("content")?.get("value")?.value;
  }

  getFile(name: string) {
    let fName = name.split('/').reverse()[0].split('\\').reverse()[0];
    return this.files.find(x => x.name === fName);
  }
}
