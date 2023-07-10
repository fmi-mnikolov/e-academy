import { Component, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StateHandler } from 'src/app/state-management/state.handler';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit, OnChanges {

  constructor(private state: StateHandler, private service: AuthService) {
    this.state.logout();
  }
  ngOnChanges(changes: SimpleChanges): void {
    this.state.logout();
  }

  ngOnInit(): void {
    this.service.logout();
    this.state.logout();
  }


}
