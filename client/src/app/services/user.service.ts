import { Subject } from '../models/subject';
import { Observable, of } from 'rxjs';
import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State, User } from '../models/state';
import { Lesson } from '../models/lesson';
import { Test } from "../models/test";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  url: string = "http://localhost:5001/users";

  constructor(private store: StateHandler, private client: HttpClient) {
  }

  getAll(): Observable<User[]> {
    let res: User[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/`, { headers: headers }).subscribe(r => {
        res = r as User[];
      });
    })
    return of(res);
  }

  get(id: string) {
    let res: User = new User();
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/${id}`, { headers: headers }).subscribe(r => {
        res = r as User;
      });
    })
    return of(res);
  }

  getSubjects() {
    let res: Subject[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/subjects`, { headers: headers }).subscribe(r => {
        res = r as Subject[];
      });
    })
    return of(res);
  }

  getSubjectsByUser(id: string) {
    let res: Subject[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/subjects/${id}`, { headers: headers }).subscribe(r => {
        res = r as Subject[];
      });
    })
    return of(res);
  }

  getCompletedSubjects() {
    let res: Subject[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/subjects`, { headers: headers }).subscribe(r => {
        res = r as Subject[];
      });
    })
    return of(res);
  }

  getCompletedLessons() {
    let res: Lesson[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/lessons`, { headers: headers }).subscribe(r => {
        res = r as Lesson[];
      });
    })
    return of(res);
  }

  getCompletedTests() {
    let res: Test[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/tests`, { headers: headers }).subscribe(r => {
        res = r as Test[];
      });
    })
    return of(res);
  }

  getCompletedSubjectsByUser(id: string) {
    let res: Subject[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/tests/${id}`, { headers: headers }).subscribe(r => {
        res = r as Subject[];
      });
    })
    return of(res);
  }

  getCompletedLessonsByUser(id: string) {
    let res: Lesson[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/tests/${id}`, { headers: headers }).subscribe(r => {
        res = r as Lesson[];
      });
    })
    return of(res);
  }

  getCompletedTestsByUser(id: string) {
    let res: Test[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/completed/tests/${id}`, { headers: headers }).subscribe(r => {
        res = r as Test[];
      });
    })
    return of(res);
  }

  addSubject(subjectId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/subjects/add/${subjectId}`, { headers: headers }).subscribe();
    });
  }

  removeSubject(subjectId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/subjects/remove/${subjectId}`, { headers: headers }).subscribe();
    });
  }

  addCompletedSubject(subjectId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/subjects/add/${subjectId}`, { headers: headers }).subscribe();
    });
  }

  removeCompletedSubject(subjectId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/subjects/remove/${subjectId}`, { headers: headers }).subscribe();
    });
  }

  addCompletedLesson(lessonId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/lessons/add/${lessonId}`, { headers: headers }).subscribe();
    });
  }

  removeCompletedLesson(lessonId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/lessons/remove/${lessonId}`, { headers: headers }).subscribe();
    });
  }

  addCompletedTest(testId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/tests/add/${testId}`, { headers: headers }).subscribe();
    });
  }

  removeCompletedTest(testId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/completed/tests/remove/${testId}`, { headers: headers }).subscribe();
    });
  }

  updateUser(user: User) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.put(`${this.url}/`, {
        username: user.username,
        password: user.password,
        email: user.email,
        picturePath: user.picturePath
      }, { headers: headers }).subscribe();
    });
  }

  updateUserAdmin(userId: string, user: User) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.put(`${this.url}/${userId}`, {
        username: user.username,
        password: user.password,
        email: user.email,
        picturePath: user.picturePath
      }, { headers: headers }).subscribe();
    });
  }

  deleteAllUsers() {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/`, { headers: headers }).subscribe();
    });
  }

  deleteUser(userId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/${userId}`, { headers: headers }).subscribe();
    });
  }
}
