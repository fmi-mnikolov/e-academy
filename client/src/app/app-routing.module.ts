import { AdminGuard } from './guards/admin.guard';
import { LoggedOutGuard } from './guards/logged-out.guard';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { LogoutComponent } from './components/logout/logout.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateSubjectComponent } from './components/create-subject/create-subject.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { LoggedInGuard } from './guards/logged-in.guard';
import { CreateLessonComponent } from './components/create-lesson/create-lesson.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { SubjectsListComponent } from './components/subjects-list/subjects-list.component';

const routes: Routes = [
  {
    path: "login",
    component: LoginComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: "logout",
    component: LogoutComponent,
    canActivate: [LoggedInGuard]
  },
  {
    path: "register",
    component: RegisterComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: "subjects/create",
    component: CreateSubjectComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "lessons/create",
    component: CreateLessonComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "tests/create",
    component: CreateTestComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "users/create",
    component: CreateUserComponent,
    canActivate: [AdminGuard]
  },
  {
    path: "subjects/get",
    component: SubjectsListComponent,
    canActivate: [AdminGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes),
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
