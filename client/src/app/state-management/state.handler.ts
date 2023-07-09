import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { State } from '../models/state';
import { Store } from '@ngrx/store';
import { login, logout } from './state.actions';

@Injectable({
    providedIn: 'root'
})
export class StateHandler {
    state$: Observable<State>;

    constructor(private store: Store<{ state: State }>) {
        this.state$ = store.select('state');
    }

    login(state: State) {
        this.store.dispatch(login({
            state: state
        }));
    }

    logout() {
        this.store.dispatch(logout());
    }
}
