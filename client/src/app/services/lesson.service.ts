import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Lesson } from '../models/lesson';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LessonService {

  url: string = "http://localhost:5001/lessons"
  constructor(private store: StateHandler, private client: HttpClient) {
  }

  getAllLessons() {
    let res: Lesson[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/`, { headers: headers }).subscribe(r => {
        res = r as Lesson[];
      });
    });
    return of(res);
  }

  getAllLessonsInSubject(subjectId: string) {
    let res: Lesson[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/by-subject/${subjectId}`, { headers: headers }).subscribe(r => {
        res = r as Lesson[];
      });
    });
    return of(res);
  }

  getLesson(lessonId: string) {
    let res: Lesson = new Lesson();
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/${lessonId}`, { headers: headers }).subscribe(r => {
        res = r as Lesson;
      });
    });
    return of(res);
  }

  createLesson(subjectId: string, lesson: Lesson) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/${subjectId}`, JSON.stringify(lesson), { headers: headers }).subscribe();
    });
  }

  updateLesson(lesson: Lesson) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/`, JSON.stringify(lesson), { headers: headers }).subscribe();
    });
  }

  deleteAll() {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/`, { headers: headers }).subscribe();
    });
  }

  deleteAllInSubject(subjectId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/by-subject/${subjectId}`, { headers: headers }).subscribe();
    });
  }

  deleteLesson(lessonId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/${lessonId}`, { headers: headers }).subscribe();
    });
  }
}
