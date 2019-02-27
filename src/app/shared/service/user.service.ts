import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';
import { CloudBaseService } from '../../cloud/service/cloud-base.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { UserInfo } from '../models/user-info.model';
import { PasswordLoginInfo } from '../models/password-login-info.model';
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

  // loginByToken(): Promise<any> {

  // }
}
