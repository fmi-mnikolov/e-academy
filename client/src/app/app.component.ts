import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { State, User } from './models/state';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client';
  state!: Observable<State>;

  constructor(private store: Store<State>) { }

  async getState() {
    this.state = this.store as Observable<State>;
  }
}
