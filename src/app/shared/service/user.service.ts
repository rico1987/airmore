import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';
import { CloudBaseService } from '../../cloud/service/cloud-base.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { BrowserStorageService } from './storage.service';
import { EmailPasswordLessLoginInfo, PasswordLoginInfo, RegisterInfo, ResetPasswordInfo, UserInfo } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudBaseService: CloudBaseService,
    private myClientService: MyClientService,
    private appStateService: AppStateService,
    private storage: BrowserStorageService,
  ) {}

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
      brand: this.appConfig.brand,
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
      brand: this.appConfig.brand,
      registed_app: this.appConfig.app.registedApp,
    }
    return this.myClientService.post('account', '/users', data);
  }

  emailPasswordLessLogin(emailPasswordLessLoginInfo: EmailPasswordLessLoginInfo): Observable <any> {
    const data = {
      captcha: emailPasswordLessLoginInfo.captcha,
      email: emailPasswordLessLoginInfo.email,
      language: this.appStateService.currentLanguage,
      brand: this.appConfig.brand,
      registed_app: this.appConfig.app.registedApp,
    }
    return this.myClientService.post('account', '/users', data);
  }

  private _userInfo: UserInfo;
  public get userInfo(): UserInfo {
    return this._userInfo || this.storage.get(this.appConfig.app.accountStorageKey);;
  }
  public set userInfo(v: UserInfo) {
    this.storage.set(this.appConfig.app.accountStorageKey, v);
    this.cloudBaseService.getCloudToken(v);
    this._userInfo = v;
  }

  public isAccountLogined = false; // 账号是否已登陆
}
