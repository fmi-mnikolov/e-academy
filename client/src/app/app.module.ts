import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StoreModule } from '@ngrx/store';
import { stateReducer } from './state-management/state.reducer';
import { HttpClientModule } from "@angular/common/http";
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CreateUserComponent } from './components/create-user/create-user.component';
import { CreateSubjectComponent } from './components/create-subject/create-subject.component';
import { CreateLessonComponent } from './components/create-lesson/create-lesson.component';
import { CreateTestComponent } from './components/create-test/create-test.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { LogoutComponent } from './components/logout/logout.component';
import ContentComponentComponent from './components/content-component/content-component.component';
import { SubjectsListComponent } from './components/subjects-list/subjects-list.component';
import { LessonsListComponent } from './components/lessons-list/lessons-list.component';
import { TestsListComponent } from './components/tests-list/tests-list.component';
import { UserSubjectsListComponent } from './components/user-subjects-list/user-subjects-list.component';
import { SubjectComponent } from './components/subject/subject.component';
import { TestComponent } from './components/test/test.component';
import { LessonComponent } from './components/lesson/lesson.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    CreateUserComponent,
    CreateSubjectComponent,
    CreateLessonComponent,
    CreateTestComponent,
    NavbarComponent,
    LogoutComponent,
    ContentComponentComponent,
    SubjectsListComponent,
    LessonsListComponent,
    TestsListComponent,
    UserSubjectsListComponent,
    TestComponent,
    LessonComponent,
    SubjectComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    CommonModule,
    FormsModule,
    StoreModule.forRoot({
      state: stateReducer
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
