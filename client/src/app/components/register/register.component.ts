import { AuthService } from './../../services/auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component } from '@angular/core';
import { User } from 'src/app/models/state';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  file!: File;

  constructor(fb: FormBuilder, private auth: AuthService) {
    this.registerForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      email: ["", Validators.required, Validators.email],
      picturePath: ["", Validators.required]
    });
  }

  onSubmit() {
    let user = this.registerForm.value as User;
    this.auth.register(user, this.file);
  }

  uploadFile(event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }
}
