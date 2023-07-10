import { Component, Input, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Lesson } from 'src/app/models/lesson';
import { Test } from 'src/app/models/test';
import { MediaService } from 'src/app/services/media.service';
import { TestService } from 'src/app/services/test.service';

@Component({
  selector: 'app-lesson',
  templateUrl: './lesson.component.html',
  styleUrls: ['./lesson.component.css']
})
export class LessonComponent {
  @Input()
  lesson!: Lesson;
  tests!: Observable<Test[]>;
  files: File[] = [];
  constructor(private service: TestService, private media: MediaService) {
    this.tests = this.service.getAllTestsInLesson(this.lesson._id!);
    this.lesson.content.filter(c => c.type === "IMAGE" || c.type === "VIDEO").forEach(c => {
      this.media.getLessonPicture(c.value).subscribe(f => this.files.push(f));
    })
  }
  ngOnChanges(changes: SimpleChanges): void {
  }

  getFile(name: string) {
    let fName = name.split('/').reverse()[0].split('\\').reverse()[0];
    return this.files.find(f => f.name === fName);
  }
}
