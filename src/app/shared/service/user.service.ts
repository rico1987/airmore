import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';
import { CloudBaseService } from '../../cloud/service/cloud-base.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { UserInfo } from '../models/user-info.model';
import { PasswordLoginInfo } from '../models/password-login-info.model';
import { ResetPasswordInfo } from '../models/reset-password-info.model';
import { EmailPasswordLessLoginInfo } from '../models/email-password-login-info.model';
import { RegisterInfo } from '../models/register-info.model';
import { BrowserStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: UserInfo;

  public isAccountLogined = false; // 账号是否已登陆

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudBaseService: CloudBaseService,
    private myClientService: MyClientService,
    private appStateService: AppStateService,
    private storage: BrowserStorageService,
  ) {}

  setUserInfo(v: UserInfo): void {
    this.storage.set(this.appConfig.app.accountStorageKey, v);
    this.cloudBaseService.getCloudToken(v);
    this.userInfo = v;
  }

  getUserInfo(): UserInfo | any {
    return this.userInfo || this.storage.get(this.appConfig.app.accountStorageKey);
  }

  accountLogin(passwordLoginInfo: PasswordLoginInfo): Observable < any > {
    const data = {
      password: passwordLoginInfo.password,
      brand: this.appConfig.brand,
      language: this.appStateService.currentLanguage,
    };

    if (passwordLoginInfo.email) {
      data['email'] = passwordLoginInfo.email;
    }
    return this.myClientService.post('account', '/sessions', data);
  }

  resetPassword(resetPasswordInfo: ResetPasswordInfo): Observable < any > {
    const data = {
      captcha: resetPasswordInfo.captcha,
      email: resetPasswordInfo.email,
      language: this.appStateService.currentLanguage,
      password: resetPasswordInfo.password,
      brand: 'Apowersoft',
    };
    return this.myClientService.put('account', '/passwords', data);
  }

  getCaptchaByEmail(scene: string, email: string): Observable < any > {
    const data = {
      brand: this.appConfig.brand,
      email,
      scene,
      language: this.appStateService.currentLanguage,
    };
    return this.myClientService.post('account', '/captchas', data);
  }

  getCaptchaByPhone(scene: string, telephone: string, country_code: string): Observable < any > {
    const data = {
      brand: this.appConfig.brand,
      telephone,
      country_code,
      scene,
      language: this.appStateService.currentLanguage,
    };
    return this.myClientService.post('account', '/captchas', data);
  }

  register(registerInfo: RegisterInfo): Observable <any> {
    const data = {
      captcha: registerInfo.captcha,
      email: registerInfo.email,
      password: registerInfo.email,
      language: this.appStateService.currentLanguage,
      brand: 'Apowersoft',
      registed_app: 'web.airmore.com',
    }
    return this.myClientService.post('account', '/users', data);
  }

  emailPasswordLessLogin(emailPasswordLessLoginInfo: EmailPasswordLessLoginInfo): Observable <any> {
    const data = {
      captcha: emailPasswordLessLoginInfo.captcha,
      email: emailPasswordLessLoginInfo.email,
      language: this.appStateService.currentLanguage,
      brand: 'Apowersoft',
      registed_app: 'web.airmore.com',
    }
    return this.myClientService.post('account', '/users', data);
  }
}
