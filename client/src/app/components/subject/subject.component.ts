import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Subject } from './../../../../../server/src/models/subject';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LessonService } from 'src/app/services/lesson.service';
import { MediaService } from 'src/app/services/media.service';
import { Lesson } from 'src/app/models/lesson';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnChanges {
  @Input()
  subject!: Subject;
  lessons!: Observable<Lesson[]>
  picture!: File;

  constructor(private service: LessonService, private media: MediaService) {

  }
  ngOnChanges(changes: SimpleChanges): void {
    this.lessons = this.getLessons();
    this.media.getSubjectPicture(this.subject.picture).subscribe(file => this.picture = file);
  }


  getLessons() {
    return this.service.getAllLessonsInSubject(this.subject._id!);
  }
}
