import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { StateHandler } from '../state-management/state.handler';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { State, User } from '../models/state';
import { Store } from '@ngrx/store';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    url: string = "http://localhost:5001/auth";

    constructor(private stateHandler: StateHandler, private client: HttpClient, private store: Store<State>) {
    }

    async login(username: string, password: string) {
        this.client.post(`${this.url}/login`, { username: username, password: password }).subscribe(state => {
            const response: State = state as State;
            if (!(response && response.user && response.accessToken && response.refreshToken)) {
                return;
            }

            this.stateHandler.login(response);
        });
    }

    register(user: User, file: File) {
        const headers = new HttpHeaders({
            'Content-Type': 'multipart/form-data',
        })
        let data = new FormData();
        data.append("json", JSON.stringify({
            username: user.username,
            password: user.password,
            email: user.email,
            picturePath: user.picturePath,

        }));
        data.append("picture", file);

        this.client.post(`${this.url}/register`, data).subscribe(state => {
            const response: State = state as State;
            if (!(response && response.user && response.accessToken && response.refreshToken)) {
                return;
            }

            this.stateHandler.login(response);
        });
    }

    logout() {
        this.store.pipe(map(data => {
            let state = (data as { state: State }).state;
            console.log(state);
            const headers = new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.accessToken}`
            });
            return this.client.delete(`${this.url}/logout`, { headers: headers })
        })).subscribe(state => {
            const response: State = state as State;
            if (!(response && response.user && response.accessToken && response.refreshToken)) {
                return;
            }

            this.stateHandler.logout();
        });
    }

    refreshToken() {
        this.stateHandler.state$.subscribe(d => {
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

                this.stateHandler.login(response);
            });
        });
    }

    createUser(user: User, file: File) {
        let token;
        this.store.select("accessToken").subscribe(s => token = s);
        const headers = new HttpHeaders({
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
        })
        let data = new FormData();
        data.append("json", JSON.stringify({
            username: user.username,
            password: user.password,
            email: user.email,
            picturePath: user.picturePath,

        }));
        data.append("picture", file);

        this.client.post(`${this.url}/create`, data).subscribe(state => {
            const response: State = state as State;
            if (!(response && response.user && response.accessToken && response.refreshToken)) {
                return;
            }

            this.stateHandler.login(response);
        });
    }
}