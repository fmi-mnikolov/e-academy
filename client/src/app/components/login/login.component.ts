import { login } from './../../state-management/state.actions';
import { Component } from '@angular/core';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(fb: FormBuilder, private auth: AuthService) {
    this.loginForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required]
    });
  }

  onSubmit() {
    this.auth.login(this.loginForm.get('username')!.value, this.loginForm.get('password')!.value);
  }
}
