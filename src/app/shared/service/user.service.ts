import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';

import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';
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
    private myClientService: MyClientService,
    private appStateService: AppStateService,
    private storage: BrowserStorageService,
  ) {
    // this.myClientService.setBaseUrl('https://passport.aoscdn.com/api');
  }

  setUserInfo(v: UserInfo): void {
    try {
      this.storage.set('userInfo', v);
    } catch(e) {
      this.storage.set('userInfo', {});
    }
    this.userInfo = v;
  }

  getUserInfo(): UserInfo {
    return this.userInfo;
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
    return this.myClientService.post('/sessions', data);
  }

  // loginByToken(): Promise<any> {

  // }
}
