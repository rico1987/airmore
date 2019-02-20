// 管理app全局状态
import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  isDebug = true; // 是否是调试模式

  isAccountLogined = false; // 账号是否已登陆

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess'

  activeConnectionType = 'account'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  constructor(private logger: Logger) { }

  changeConnectionType(connectionType: string): void {
    this.activeConnectionType = connectionType;
  }
}
