import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { CloudBaseService } from '../../../cloud/service/cloud-base.service';
import { PasswordLoginInfo } from '../../models/password-login-info.model';
import { CommonResponse } from '../../models/common-response.model';
import { CommonError } from '../../models/common-error.model';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-login-form',
  templateUrl: './password-login-form.component.html',
  styleUrls: ['./password-login-form.component.scss'],
  animations: ANIMATIONS,
})
export class PasswordLoginFormComponent implements OnInit {
  passwordLoginInfo: PasswordLoginInfo = {
    email: '272355332@qq.com',
    password: '111111',
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
            this.userService.setUserInfo(data.data);
            this.router.navigate(
              ['cloud']
            );
          },
          (error) => {
            if (error) {
              debugger
            }
          }
        );
    }
  }


  get email() { return this.passwordLoginForm.get('email'); }
  get password() { return this.passwordLoginForm.get('password'); }

}
