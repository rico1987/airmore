import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';
import { CommonResponse, PasswordLoginInfo } from '../../models';

@Component({
  selector: 'app-password-login-form',
  templateUrl: './password-login-form.component.html',
  styleUrls: ['./password-login-form.component.scss'],
  animations: ANIMATIONS,
})
export class PasswordLoginFormComponent implements OnInit {
  passwordLoginInfo: PasswordLoginInfo = {
    email: 'zyy_solo@qq.com',
    password: '123654',
  };

  passwordLoginForm: FormGroup;

  errorMessages: object =  {
    email: {
      required: 'Email is required',
      email: 'Please enter the correct email address',
    },
    password: {
      required: 'Password is required',
      minLength: 'The minimum length should be 6',
    },
  };

  constructor(
    private router: Router,
    private userService: UserService,
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
    if (this.passwordLoginForm.valid) {
      this.userService.accountLogin(this.passwordLoginInfo)
        .subscribe(
          (data: CommonResponse) => {
            this.userService.userInfo = data.data;
            this.appStateService.setCurrentModule('cloud');
            this.router.navigate(
              ['cloud']
            );
          },
          (error) => {
            if (error) {
            }
          }
        );
    }
  }


  get email() { return this.passwordLoginForm.get('email'); }
  get password() { return this.passwordLoginForm.get('password'); }

}
