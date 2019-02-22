import { Injectable } from '@angular/core';
import { AppStateService } from './app-state.service';
import { CONFIG } from '../../config';
import { UserInfo } from '../models/user-info.model';
import { PasswordLoginInfo } from '../models/password-login-info.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public isAccountLogined = false; // 账号是否已登陆

  private userInfo: UserInfo;

  constructor(private appStateService: AppStateService) { }

  setUserInfo(v: UserInfo): void {
    this.userInfo = v;
  }

  getUserInfo(): UserInfo {
    return this.userInfo;
  }

  accountLogin(passwordLoginInfo: PasswordLoginInfo): Promise<any> {
    const data = {
      password: passwordLoginInfo.password,
      brand: CONFIG.brand,
      language: this.appStateService.currentLanguage,
    }
    return 
  }

  // loginByToken(): Promise<any> {

  // }
}
