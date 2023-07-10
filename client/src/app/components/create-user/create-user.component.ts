import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/state';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent {
  registerForm: FormGroup;
  roles: string[] = ["user", "admin"];
  file!: File;

  constructor(fb: FormBuilder, private auth: AuthService) {
    this.registerForm = fb.group({
      username: ["", Validators.required],
      password: ["", Validators.required],
      role: ["", Validators.required],
      email: ["", Validators.required, Validators.email],
      picturePath: ["", Validators.required]
    });
  }

  onSubmit() {
    let user = this.registerForm.value as User;
    this.auth.createUser(user, this.file);
  }

  uploadFile(event) {
    this.file = (event.target as HTMLInputElement).files![0];
  }
}
