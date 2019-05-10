import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { CloudBaseService } from '../../../cloud/service/cloud-base.service';
import { EmailPasswordLessLoginInfo } from '../../../shared/models/email-password-login-info.model';
import { CommonResponse } from '../../models/common-response.model';
import { CommonError } from '../../models/common-error.model';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/service/message.service';

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
    if (this.count !== 0) {
      this.messageService.error('请稍后再试')
    }
    if (this.emailPasswordLessLoginForm.get('email').invalid) {
      this.messageService.error('请输入正确的邮箱！');
      return;
    }
    this.userService.getCaptchaByEmail('login', this.emailPasswordLessLoginInfo.email)
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
    if (this.emailPasswordLessLoginForm.valid) {
      this.userService.emailPasswordLessLogin(this.emailPasswordLessLoginInfo)
        .subscribe(
          (data: CommonResponse) => {
            this.userService.setUserInfo(data.data);
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


  get email() { return this.emailPasswordLessLoginForm.get('email'); }
  get captcha() { return this.emailPasswordLessLoginForm.get('captcha')};
}
