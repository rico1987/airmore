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

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess'

  activeConnectionType = 'account'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  currentLanguage: string; // 当前语言

  activeViewMode:  'list' | 'grid' = 'list';

  deviceConnected = false;

  // todo
  currentModule: 'cloud' | 'device' = 'cloud';

  activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' | 'cloud' = 'pictures';

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

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' | 'cloud' ): void {
    this.activeFunction = fun;
    if (fun !== 'cloud') {
      this.deviceStateService.setDeviceActiveFunction(fun);
    }
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
   * 是否开启调试
   */
  get isDebug() {
    return this.appConfig.app.isDebug;
  }

}
