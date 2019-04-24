// 管理app全局状态
import { Injectable, Inject } from '@angular/core';
import { Logger } from './logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { CloudStateService } from '../../cloud/service/cloud-state.service';
import { DeviceStateService } from '../../device/service/device-state.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  isAccountLogined = false; // 账号是否已登陆

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess', 'register'

  activeConnectionType = 'qrcode'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  currentLanguage: string; // 当前语言

  activeViewMode:  'list' | 'grid' = 'list';

  deviceConnected = false;

  platform: 'android' | 'iphone' = null; // 'android', 'iphone'

  currentModule: 'cloud' | 'device' = 'cloud';

  private _activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' | 'clipboard' | 'cloud' = 'pictures';

  connectionStatus: 'connecting' | 'connected' | 'disconnected'; // 当前连接状态

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudStateService: CloudStateService,
    private deviceStateService: DeviceStateService,
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

  setCurrentModule(module: 'cloud' | 'device'): void {
    this.currentModule = module;
  }

  setConnectionStatus(connectionStatus: 'connecting' | 'connected' | 'disconnected'): void {
    this.connectionStatus = connectionStatus;
  }

  setPlatform(platform: 'android' | 'iphone') {
    this.platform = platform;
  }

  /**
   * 判断是否显示某个操作按钮
   * @param action 
   */
  hasAction(action: string): boolean {
    let flag = false;
    if (this.currentModule === 'cloud') {
      switch (action) {
        case 'new-folder':
        case 'upload':
        case 'copy-or-move':
        case 'delete':
        case 'rename':
        flag =  this.cloudStateService.activeFunction === 'clouds';
        break;
        case 'download':
        case 'refresh':
        case 'select-all':
        flag = true;
        break;
        case 'new-contact':
        case 'new-message':
        case 'copy-to-clipboard':
        case 'import':
        case 'install':
        case 'backup':
        case 'set-as-wallpaper':
        break;
      }
    } else {

    }
    return flag;
  }

  /**
   * 判断某个按钮是否可用
   * @param action 
   */
  isInactive(action: string): boolean {
    let flag = false;
    switch (action) {
      case 'download':
      case 'delete':
      case 'copy-or-move':
        flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length === 0) || (this.currentModule == 'device' && this.deviceStateService.selectedItems.length === 0)
        break;
      case 'rename':
      flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length !== 1) || (this.currentModule == 'device' && this.deviceStateService.selectedItems.length !== 1)
    }
    return flag;
  }

  /**
   * 是否开启调试
   */
  get isDebug() {
    return this.appConfig.app.isDebug;
  }

  get loading(): boolean {
    if (this.currentModule === 'cloud') {
      return this.cloudStateService.loading;
    } else if (this.currentModule === 'device'){
      return this.deviceStateService.loading;
    }
    return false;
  }

  get activeFunction(): any {
    if (this.currentModule === 'cloud') {
      return this.cloudStateService.activeFunction;
    } else if (this.currentModule === 'device') {
      return this.deviceStateService.activeFunction;
    }
  }
}
