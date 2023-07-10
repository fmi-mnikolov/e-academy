import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { map, Observable } from 'rxjs';
import { Lesson } from 'src/app/models/lesson';
import { Test } from 'src/app/models/test';
import { AuthService } from 'src/app/services/auth.service';
import { LessonService } from 'src/app/services/lesson.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-create-test',
  templateUrl: './create-test.component.html',
  styleUrls: ['./create-test.component.css']
})
export class CreateTestComponent {
  testForm: FormGroup;
  lessons!: Observable<Lesson[]>;
  constructor(fb: FormBuilder, private service: TestService, private lessonService: LessonService) {
    this.testForm = fb.group({
      name: ["", Validators.required],
      quesiton: ["", Validators.required],
      answer: ["", Validators.required],
      lessonId: ["", Validators.required],

    });
    this.lessons = this.getLessons();
  }

  getLessons() {
    return this.lessonService.getAllLessons();
  }
  onSubmit() {
    let test = this.testForm.value as Test;
    this.service.createTest(this.testForm.get("lessonId")?.value, test);
  }
}
