import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router, CanActivate } from '@angular/router';
import { StateHandler } from '../state-management/state.handler';
import { State, User } from '../models/state';
import { Observable, map, of } from 'rxjs';
import { Store } from '@ngrx/store';
@Injectable({
    providedIn: 'root'
})
export class LoggedOutGuard implements CanActivate {
    constructor(private state: Store<State>, private router: Router) { };

    canActivate(): Observable<boolean> | boolean {
        console.log('CanActivate called');
        return this.state.pipe(map(data => {
            let state = (data as { state: State }).state;
            if (!state.user) {
                return true;
            } else {
                this.router.navigate(['/']);
                return false;
            }
        }));
    }

}