import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'src/app/models/subject';
import { SubjectService } from 'src/app/services/subject.service';

@Component({
  selector: 'app-subjects-list',
  templateUrl: './subjects-list.component.html',
  styleUrls: ['./subjects-list.component.css']
})

export class SubjectsListComponent implements OnChanges {
  subjects!: Observable<Subject[]>;

  constructor(private service: SubjectService) {
    this.subjects = this.service.getAllSubjects();
  }

  ngOnChanges(changes: SimpleChanges): void {

  }

}
