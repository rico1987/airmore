import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailPasswordLessLoginFormComponent } from './email-password-less-login-form.component';

describe('EmailPasswordLessLoginFormComponent', () => {
  let component: EmailPasswordLessLoginFormComponent;
  let fixture: ComponentFixture<EmailPasswordLessLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmailPasswordLessLoginFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmailPasswordLessLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
