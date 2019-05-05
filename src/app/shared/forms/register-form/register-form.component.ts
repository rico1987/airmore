import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { AppStateService } from '../../service/app-state.service';
import { UserService } from '../../service/user.service';
import { CloudBaseService } from '../../../cloud/service/cloud-base.service';
import { RegisterInfo } from '../../models/register-info.model';
import { CommonResponse } from '../../models/common-response.model';
import { CommonError } from '../../models/common-error.model';
import { ANIMATIONS } from '../../animations';
import { Router } from '@angular/router';
import { MessageService } from '../../../shared/service/message.service';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss'],
  animations: ANIMATIONS,
})
export class RegisterFormComponent implements OnInit {

  registerInfo: RegisterInfo = {
    captcha: '',
    email: '',
    password: '',
  }


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

  registerForm: FormGroup;

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
    this.registerForm = new FormGroup({
      email: new FormControl(this.registerInfo.email, [
        Validators.required,
        Validators.email,
        Validators.maxLength(50),
      ]),
      captcha: new FormControl(this.registerInfo.captcha, [
        Validators.required,
        Validators.minLength(4),
      ]),
      password: new FormControl(this.registerInfo.password, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(20),
      ]),
    });
  }

  getCaptcha(): void {
    if (this.registerForm.get('email').invalid) {
      this.messageService.error('请输入正确的邮箱！');
      return;
    }
    this.userService.getCaptchaByEmail('register', this.registerInfo.email)
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
    if (this.registerForm.valid) {
      this.userService.register(this.registerInfo)
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
            if (error) {
            }
          }
        );
    }
  }


  get email() { return this.registerForm.get('email'); }
  get captcha() { return this.registerForm.get('captcha')};
  get password() { return this.registerForm.get('password'); }

}
