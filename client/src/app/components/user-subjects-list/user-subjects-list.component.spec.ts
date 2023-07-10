import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSubjectsListComponent } from './user-subjects-list.component';

describe('UserSubjectsListComponent', () => {
  let component: UserSubjectsListComponent;
  let fixture: ComponentFixture<UserSubjectsListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserSubjectsListComponent]
    });
    fixture = TestBed.createComponent(UserSubjectsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
