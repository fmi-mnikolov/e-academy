import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from '../models/subject';
import { Observable, of } from 'rxjs';
import { State } from '../models/state';
import { Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root'
})
export class SubjectService {

  url: string = "http://localhost:5001/subjects"

  constructor(private store: Store<State>, private client: HttpClient) {
  }

  getAllSubjects(): Observable<Subject[]> {
    return this.client.get<Subject[]>(`${this.url}/`);
  }

  getSubject(subjectId: string) {
    let res: Subject = new Subject();
    this.store.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/${subjectId}`, { headers: headers }).subscribe(r => {
        res = r as Subject;
      });
    });
    return of(res);
  }

  createSubject(subject: Subject) {
    this.store.select("accessToken").subscribe(data => {
      console.log(data);
      let token = data;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/`, JSON.stringify(subject), { headers: headers }).subscribe();
    });
  }

  updateSubject(subject: Subject, subjectId: string) {
    this.store.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.put(`${this.url}/${subjectId}`, JSON.stringify(subject), { headers: headers }).subscribe();
    });
  }

  deleteAll() {
    this.store.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/`, { headers: headers }).subscribe();
    });
  }

  deleteSubject(subjectId: string) {
    this.store.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/${subjectId}`, { headers: headers }).subscribe();
    });
  }
}
