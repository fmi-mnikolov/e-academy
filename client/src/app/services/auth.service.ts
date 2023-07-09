import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State, User } from '../models/state';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    url: string = "http://localhost:5001/auth";

    constructor(private store: StateHandler, private client: HttpClient) {
    }

    async login(username: string, password: string) {
        this.client.post(`${this.url}/login`, { username: username, password: password }).subscribe(state => {
            const response: State = state as State;
            if (!(response && response.user && response.accessToken && response.refreshToken)) {
                return;
            }

            this.store.login(response);
        });
    }

    register(user: User) {
        this.client.post(`${this.url}/register`,
            {
                username: user.username,
                password: user.password,
                email: user.email,
                picturePath: user.picturePath,

            }).subscribe(state => {
                const response: State = state as State;
                if (!(response && response.user && response.accessToken && response.refreshToken)) {
                    return;
                }

                this.store.login(response);
            });
    }

    logout() {
        this.store.state$.subscribe(d => {
            let token = d.accessToken;
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
            this.client.post(`${this.url}/logout`, {}, { headers: headers }).subscribe(state => {
                const response: State = state as State;
                if (!(response && response.user && response.accessToken && response.refreshToken)) {
                    return;
                }

                this.store.login(response);
            });
        });
    }

    refreshToken() {
        this.store.state$.subscribe(d => {
            let user: User = d.user!;
            let token = d.refreshToken;
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
            this.client.post(`${this.url}/token`, {}, { headers: headers }).subscribe(state => {
                const response: State = state as State;
                response.user = user;
                if (!(response && response.accessToken && response.refreshToken)) {
                    return;
                }

                this.store.login(response);
            });
        });
    }

    createUser(user: User) {
        this.store.state$.subscribe(d => {
            let token = d.accessToken;
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            });
            this.client.post(`${this.url}/create`, {
                username: user.username,
                password: user.password,
                role: user.role,
                email: user.email,
                picturePath: user.picturePath,

            }, { headers: headers }).subscribe(state => {
                const response: State = state as State;
                if (!(response && response.accessToken && response.refreshToken)) {
                    return;
                }
            });
        });
    }
}