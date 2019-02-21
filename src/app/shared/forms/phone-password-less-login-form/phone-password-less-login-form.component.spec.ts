import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PhonePasswordLessLoginFormComponent } from './phone-password-less-login-form.component';

describe('PhonePasswordLessLoginFormComponent', () => {
  let component: PhonePasswordLessLoginFormComponent;
  let fixture: ComponentFixture<PhonePasswordLessLoginFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PhonePasswordLessLoginFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PhonePasswordLessLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
