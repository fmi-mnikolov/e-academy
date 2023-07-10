import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../models/state';
import { Store, props } from '@ngrx/store';
import { login, logout } from './state.actions';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class StateHandler {
    state$: Observable<State>;

    constructor(private store: Store<{ state: State }>, private router: Router) {
        this.state$ = store.select('state');
    }

    login(state: State) {
        this.store.dispatch(login({ state }));
        this.router.navigate(['/']);
    }

    logout() {
        this.store.dispatch(logout());
    }
}
