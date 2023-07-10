import { State } from './../models/state';
import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { StateHandler } from '../state-management/state.handler';
import { User } from '../models/state';
import { Store } from '@ngrx/store';
@Injectable({
    providedIn: 'root'
})
export class AdminGuard {
    constructor(private state: Store<State>, private router: Router) { };

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | boolean {
        console.log('CanActivate called');

        

        return this.state.pipe(map(data => {
            let state = (data as { state: State }).state;
            if(!state){
                this.router.navigate(['/']);
                return false;
            }
            if (!state.user) {
                this.router.navigate(['/']);
                return false;
            } else if (state.user.role === "user") {
                this.router.navigate(['/']);
                return false;
            } else {
                return true;
            }
        }));
    }

}