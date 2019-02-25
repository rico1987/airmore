import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';
import { CONFIG } from '../../config';
import { UserInfo } from '../models/user-info.model';
import { PasswordLoginInfo } from '../models/password-login-info.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userInfo: UserInfo;

  public isAccountLogined = false; // 账号是否已登陆

  constructor(
    private myClientService: MyClientService,
    private appStateService: AppStateService
  ) {
    this.myClientService.setBaseUrl(CONFIG.accountApiBaseUrl);
  }

  setUserInfo(v: UserInfo): void {
    this.userInfo = v;
  }

  getUserInfo(): UserInfo {
    return this.userInfo;
  }

  accountLogin(passwordLoginInfo: PasswordLoginInfo): Observable<any> {
    const data = {
      password: passwordLoginInfo.password,
      brand: CONFIG.brand,
      language: this.appStateService.currentLanguage,
    }
    if (passwordLoginInfo.email) {
      data['email'] = passwordLoginInfo.email;
    }
    return this.myClientService.post('/sessions', data);
  }

  // loginByToken(): Promise<any> {

  // }
}
