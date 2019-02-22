// 管理app全局状态
import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  isDebug: boolean = CONFIG.app.isDebug; // 是否是调试模式

  isAccountLogined = false; // 账号是否已登陆

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess'

  activeConnectionType = 'account'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  currentLanguage: string = CONFIG.app.defaultLang; // 当前语言

  constructor(private logger: Logger) { }

  changeConnectionType(connectionType: string): void {
    this.activeConnectionType = connectionType;
  }

  setCurrentLang(lang: string): void {
    this.currentLanguage = lang;
  }
}
