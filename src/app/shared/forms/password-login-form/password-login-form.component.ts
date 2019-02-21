import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { PasswordLoginInfo } from '../../models/password-login-info.model';

@Component({
  selector: 'app-password-login-form',
  templateUrl: './password-login-form.component.html',
  styleUrls: ['./password-login-form.component.scss']
})
export class PasswordLoginFormComponent implements OnInit {
  passwordLoginInfo: PasswordLoginInfo = {
    email: '',
    phone: '',
    password: '',
  };
  passwordLoginForm: FormGroup;

  errorMessages: any =  {
    email: {
      required: 'Email is required',
      email: 'Please enter the correct email address',
    },
    password: {
      required: 'Password is required',
      minLength: '',
    },
  };

  constructor(
    private appStateService: AppStateService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.passwordLoginForm = new FormGroup({
      email: new FormControl(this.passwordLoginInfo.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      password: new FormControl(this.passwordLoginInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  onSubmit(): void {
    debugger
    if (this.passwordLoginForm.valid) {
      debugger
    }
  }


  get email() { return this.passwordLoginForm.get('email'); }
  get password() { return this.passwordLoginForm.get('password'); }

}
