import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComponentType, Lesson } from 'src/app/models/lesson';
import { Subject } from 'src/app/models/subject';
import { LessonService } from 'src/app/services/lesson.service';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-create-subject',
  templateUrl: './create-subject.component.html',
  styleUrls: ['./create-subject.component.css']
})
export class CreateSubjectComponent {
  subjectForm!: FormGroup;

  constructor(private service: SubjectService, fb: FormBuilder) {
    this.subjectForm = fb.group({
      name: ["", Validators.required],
    })
  }

  onSubmit() {
    let subject = this.subjectForm.value as Subject;
    this.service.createSubject(subject);
  }
}

