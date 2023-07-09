import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Test } from '../models/test';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TestService {

  url: string = "http://localhost:5001/tests"
  constructor(private store: StateHandler, private client: HttpClient) {
  }

  getAllTests() {
    let res: Test[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/`, { headers: headers }).subscribe(r => {
        res = r as Test[];
      });
    });
    return of(res);
  }

  getAllTestsInLesson(lessonId: string) {
    let res: Test[] = [];
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/by-lesson/${lessonId}`, { headers: headers }).subscribe(r => {
        res = r as Test[];
      });
    });
    return of(res);
  }

  getTest(testId: string) {
    let res: Test = new Test();
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.get(`${this.url}/${testId}`, { headers: headers }).subscribe(r => {
        res = r as Test;
      });
    });
    return of(res);
  }

  createTest(lessonId: string, test: Test) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/${lessonId}`, JSON.stringify(test), { headers: headers }).subscribe();
    });
  }

  updateTest(test: Test) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.post(`${this.url}/`, JSON.stringify(test), { headers: headers }).subscribe();
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

  deleteAllInLesson(lessonId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/by-lesson/${lessonId}`, { headers: headers }).subscribe();
    });
  }

  deleteTest(testId: string) {
    this.store.state$.subscribe(data => {
      let token = data.accessToken;
      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      });
      this.client.delete(`${this.url}/${testId}`, { headers: headers }).subscribe();
    });
  }
}
