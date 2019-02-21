import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PasswordLoginFormComponent } from './password-login-form.component';

describe('PasswordLoginFormComponent', () => {
  let component: PasswordLoginFormComponent;
  let fixture: ComponentFixture<PasswordLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PasswordLoginFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PasswordLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
