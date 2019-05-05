import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { CloudBaseService } from '../../../cloud/service/cloud-base.service';
import { ResetPasswordInfo } from '../../../shared/models/reset-password-info.model';
import { CommonResponse } from '../../models/common-response.model';
import { CommonError } from '../../models/common-error.model';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/service/message.service';


@Component({
  selector: 'app-reset-password-form',
  templateUrl: './reset-password-form.component.html',
  styleUrls: ['./reset-password-form.component.scss'],
  animations: ANIMATIONS,
})
export class ResetPasswordFormComponent implements OnInit {

  resetPasswordInfo: ResetPasswordInfo = {
    captcha: '',
    email: '272355332@qq.com',
    password: ''
  };

  errorMessages: object =  {
    email: {
      required: 'Email is required',
      email: 'Please enter the correct email address',
    },
    captcha: {
      required: 'Captcha is required',
      minLength: 'The minimum length shoud be 4',
    },
    password: {
      required: 'Password is required',
      minLength: 'The minimum length should be 6',
    },
  };

  resetPasswordForm: FormGroup;

  count: number;

  interval: any = null;

  constructor(
    private router: Router,
    private userService: UserService,
    private appStateService: AppStateService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) { }


  ngOnInit() {
    this.resetPasswordForm = new FormGroup({
      email: new FormControl(this.resetPasswordInfo.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      captcha: new FormControl(this.resetPasswordInfo.captcha, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(this.resetPasswordInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  getCaptcha(): void {
    if (this.count !== 0) {
      this.messageService.error('请稍后再试')
    }
    if (this.resetPasswordForm.get('email').invalid) {
      this.messageService.error('请输入正确的邮箱！');
      return;
    }
    this.userService.getCaptchaByEmail('resetpwd', this.resetPasswordInfo.email)
      .subscribe(
        (data: CommonResponse) => {
          if (data && data.status === '1') {
            this.count = 60;
            this.interval = setInterval(() => {
              this.count --;
            }, 1000);
          }
        },
        (error) => {
          if (error) {
          }
        }
      );
  }

  onSubmit(): void {
    if (this.resetPasswordForm.valid) {
      debugger
      this.userService.resetPassword(this.resetPasswordInfo)
        .subscribe(
          (data: CommonResponse) => {
            debugger
            this.userService.setUserInfo(data.data);
            this.appStateService.setCurrentModule('cloud');
            this.router.navigate(
              ['cloud']
            );
          },
          (error) => {
            debugger
            if (error) {
              debugger
            }
          }
        );
    }
  }


  get email() { return this.resetPasswordForm.get('email'); }
  get captcha() { return this.resetPasswordForm.get('captcha')};
  get password() { return this.resetPasswordForm.get('password'); }

}
