// 管理app全局状态
import { Injectable, Inject } from '@angular/core';
import { Logger } from './logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  // isDebug: boolean = CONFIG.app.isDebug; // 是否是调试模式

  isAccountLogined = false; // 账号是否已登陆

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess'

  activeConnectionType = 'account'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  currentLanguage: string; // 当前语言

  activeViewMode:  'list' | 'grid' = 'list';

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private logger: Logger,
  ) { }

  setActiveViewMode(mode: 'list' | 'grid'): void {
    this.activeViewMode = mode;
  }

  changeConnectionType(connectionType: string): void {
    this.activeConnectionType = connectionType;
  }

  setCurrentLang(lang: string): void {
    this.currentLanguage = lang;
  }

  get isDebug() {
    return this.appConfig.app.isDebug;
  }

}
