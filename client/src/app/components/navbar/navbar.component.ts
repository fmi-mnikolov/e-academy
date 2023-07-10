import { Component } from '@angular/core';
import { StateHandler } from 'src/app/state-management/state.handler';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {

  constructor(private state: StateHandler) { }

  isLoggedIn(): boolean {
    let res: boolean = false;
    this.state.state$.subscribe(state => {
      res = state.user ? true : false;
    })

    return res;
  }

  isAdmin(): boolean {
    let res: boolean = false;
    this.state.state$.subscribe(state => {
      res = state.user?.role === 'admin' ? true : false;
    })

    return res;
  }
}
