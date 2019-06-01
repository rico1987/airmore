import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/service/message.service';
import { CommonResponse, EmailPasswordLessLoginInfo } from '../../models';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse } from '@angular/common/http';


@Component({
  selector: 'app-email-password-less-login-form',
  templateUrl: './email-password-less-login-form.component.html',
  styleUrls: ['./email-password-less-login-form.component.scss'],
  animations: ANIMATIONS,
})
export class EmailPasswordLessLoginFormComponent implements OnInit {

  emailPasswordLessLoginInfo: EmailPasswordLessLoginInfo = {
    captcha: '',
    email: '',
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
  };

  emailPasswordLessLoginForm: FormGroup;

  count: number;

  interval: any = null;

  loading = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private appStateService: AppStateService,
    private fb: FormBuilder,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.emailPasswordLessLoginForm = new FormGroup({
      email: new FormControl(this.emailPasswordLessLoginInfo.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      captcha: new FormControl(this.emailPasswordLessLoginInfo.captcha, [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
  }

  getCaptcha(): void {

    if (this.emailPasswordLessLoginForm.get('email').invalid) {
      this.messageService.error('请输入正确的邮箱！');
      return;
    }
    this.userService.getCaptchaByEmail('login', this.emailPasswordLessLoginInfo.email)
      .subscribe(
        (data: CommonResponse) => {
          if (data && data.status === '1') {
            this.count = 60;
            this.interval = window.setInterval(() => {
              this.count --;
              if (this.count === 0) {
                window.clearInterval(this.interval);
              }
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
    if (this.emailPasswordLessLoginForm.valid && !this.loading) {
      this.loading = true;
      this.userService.emailPasswordLessLogin(this.emailPasswordLessLoginInfo)
        .subscribe(
          (data: CommonResponse) => {
            this.userService.isAccountLogined = true;
            this.userService.userInfo = data.data;
            this.appStateService.hideConnection();
            this.appStateService.setCurrentModule('cloud');
            this.router.navigate(
              ['cloud']
            );
            this.loading = false;
          },
          (error) => {
            if (error instanceof HttpErrorResponse) {
              if (error.error.status === -206) {
                this.messageService.error('Invalid verification code');
              }
            }
            this.loading = false;
          },
          () => {
          }
        );
    }
  }


  get email() { return this.emailPasswordLessLoginForm.get('email'); }
  get captcha() { return this.emailPasswordLessLoginForm.get('captcha')};
}
