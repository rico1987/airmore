// 管理app全局状态
import { Injectable, Inject } from '@angular/core';
import { Logger } from './logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { CloudStateService } from '../../cloud/service/cloud-state.service';
import { DeviceStateService } from '../../device/service/device-state.service';
import { BrowserStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  isAccountLogined = false; // 账号是否已登陆

  accountRoute = 'passwordLogin'; // 'resetPassword', 'phonePasswordLess', 'emailPasswordLess', 'register'

  activeConnectionType = 'qrcode'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  currentLanguage: string; // 当前语言

  deviceConnected = false;

  _platform: 'android' | 'iphone' = null; // 'android', 'iphone'

  currentModule: 'cloud' | 'device' = 'cloud';

  private _activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' |
   'tools' | 'clipboard' | 'cloud' = 'pictures';

  connectionStatus: 'connecting' | 'connected' | 'disconnected'; // 当前连接状态

  // todo
  isSupportZipDownload: boolean = false;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudStateService: CloudStateService,
    private deviceStateService: DeviceStateService,
    private storage: BrowserStorageService,
    private logger: Logger,
  ) {
    this.currentLanguage = this.appConfig.app.defaultLang;
  }

  setActiveViewMode(mode: 'list' | 'grid'): void {
    if (this.currentModule === 'cloud') {
      this.cloudStateService.setActiveViewMode(mode);
    } else if (this.currentModule === 'device') {
      this.deviceStateService.setActiveViewMode(mode);
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

  setPlatform(platform: 'android' | 'iphone') {
    this._platform = platform;
  }

  doAction(action: string, isInactive: boolean): void {
    if (isInactive) {
      return;
    }
    switch (action) {
      case 'refresh':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.refreshItemList();
        } else if (this.currentModule === 'device') {
          this.deviceStateService.refreshItemList();
        }
        break;
      case 'new-folder':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.newFolder()
        } else if (this.currentModule === 'device') {
          this.deviceStateService.newFolder();
        }
        break;
      case 'download':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.downloadItems();
        }
        break;
      case 'select-all':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.selectAll();
        } else if (this.currentModule === 'device') {
          this.deviceStateService.selectAll();
        }
        break;
      case 'delete':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.deleteItems();
        } else if (this.currentModule === 'device') {
          if (this.deviceStateService.activeFunction === 'apps') {
            this.deviceStateService.uninstall()
          } else if (this.deviceStateService.activeFunction === 'clipboard' || this.deviceStateService.activeFunction === 'documents' || this.deviceStateService.activeFunction === 'videos' || this.deviceStateService.activeFunction === 'files' || this.deviceStateService.activeFunction === 'pictures') {
            this.deviceStateService.deleteItems();
          }
        }
        break;
      case 'rename':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.rename();
        }
        break;
      case 'upload':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.upload();
        } else if (this.currentModule === 'device') {
          // this.deviceStateService.upload();
        }
        break;
      case 'copy-or-move':
        if (this.currentModule === 'cloud') {
          this.cloudStateService.copy();
        } else if (this.currentModule === 'device') {

        }
        break;
      case 'backup':
        if (this.currentModule === 'device') {
          this.deviceStateService.backupApps();
        }
        break;
      case 'install':
        this.deviceStateService.install();
        break;
      case 'export':
        if (this.currentModule === 'device') {
          this.deviceStateService.export();
        } else if (this.currentModule === 'cloud') {
          this.cloudStateService.export();
        }
        break;
      case 'copy-to-clipboard':
        if (this.currentModule === 'device') {
          this.deviceStateService.copyToClipboard();
        }
        break;
      case 'import':
        if (this.currentModule === 'device') {
          this.deviceStateService.import();
        }
        break;
      case 'new-message':
        this.deviceStateService.newMessage();
        break;
      case 'set-as-wallpaper':
        this.deviceStateService.setAsWallpaper();
        break;
    }
  }

  /**
   * 判断是否显示某个操作按钮
   */
  hasAction(action: string): boolean {
    // todo
    let flag = false;
    if (this.currentModule === 'cloud') {
      switch (action) {
        case 'new-folder':
        case 'upload':
        case 'copy-or-move':
        flag =  this.cloudStateService.activeFunction === 'clouds';
        break;
        case 'delete':
        case 'rename':
        flag = this.cloudStateService.activeFunction !== 'pictures';
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
    } else if (this.currentModule === 'device') {
      switch (action) {
        case 'new-folder':
        flag = this.deviceStateService.activeFunction === 'files';
        break;
        case 'refresh':
        flag = true;
        break;
        case 'select-all':
        flag = this.deviceStateService.activeFunction !== 'messages';
        break;
        case 'delete':
        flag = this.deviceStateService.activeFunction !== 'messages';
        break;
        case  'import':
        flag = this.deviceStateService.activeFunction === 'pictures' ||
               this.deviceStateService.activeFunction === 'videos' ||
               this.deviceStateService.activeFunction === 'musics' ||
               this.deviceStateService.activeFunction === 'documents' ||
               this.deviceStateService.activeFunction === 'files';
        break;
        case 'export':
        flag = this.deviceStateService.activeFunction === 'pictures' ||
               this.deviceStateService.activeFunction === 'videos' ||
               this.deviceStateService.activeFunction === 'musics' ||
               this.deviceStateService.activeFunction === 'documents' ||
               this.deviceStateService.activeFunction === 'clipboard' ||
               this.deviceStateService.activeFunction === 'files';
        break;
        case 'install':
        flag = this.deviceStateService.activeFunction === 'apps';
        break;
        case 'backup':
        flag = this.deviceStateService.activeFunction === 'apps';
        break;
        case 'copy-to-clipboard':
        flag = this.deviceStateService.activeFunction === 'clipboard';
        break;
        case 'new-message':
        flag = this.deviceStateService.activeFunction === 'messages';
        break;
        case 'set-as-wallpaper':
        flag = this.deviceStateService.activeFunction === 'pictures';
        break;
      }
    }
    return flag;
  }

  /**
   * 判断某个按钮是否可用
   */
  isInactive(action: string): boolean {
    let flag = false;
    switch (action) {
      case 'download':
      case 'copy-or-move':
        flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length === 0) ||
        (this.currentModule === 'device' && this.deviceStateService.selectedItems.length === 0);
        break;
      case 'rename':
        flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length !== 1) ||
        (this.currentModule === 'device' && this.deviceStateService.selectedItems.length !== 1);
        break;
      case 'backup':
        flag = this.currentModule === 'device' && this.deviceStateService.selectedItems.length === 0;
        break;
      case 'delete':
        flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length === 0) ||
               (this.currentModule === 'device' && this.deviceStateService.activeFunction === 'apps' && this.deviceStateService.selectedItems.length !== 1) ||
               (this.currentModule === 'device' && this.deviceStateService.activeFunction !== 'apps' && this.deviceStateService.selectedItems.length === 0)
        break;
      case 'export':
        flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length !== 1) ||
        (this.currentModule === 'device' && this.deviceStateService.selectedItems.length === 0);
        break;
      case 'set-as-wallpaper':
        flag = (this.currentModule === 'device' && this.deviceStateService.selectedItems.length !== 1)
        break;
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
    } else if (this.currentModule === 'device') {
      return this.deviceStateService.loading;
    }
    return false;
  }

  get activeFunction(): any {
    if (this.currentModule === 'cloud') {
      return 'cloud';
    } else if (this.currentModule === 'device') {
      return this.deviceStateService.activeFunction;
    }
  }

  get activeViewMode(): string {
    if (this.currentModule === 'cloud') {
      return this.cloudStateService.activeViewMode;
    } else if (this.currentModule === 'device') {
      return this.deviceStateService.activeViewMode;
    }
  }

  get platform(): 'android' | 'iphone' {
    if (this._platform) {
      return this._platform;
    } else {
      const deviceInfo = this.storage.get('deviceInfo');
      let platform;
      if (deviceInfo) {
        if (deviceInfo['Platform'] === 1) {
          platform = 'android';
        } else if (deviceInfo['Platform'] === 2) {
          platform = 'iphone';
        }
      } 
      
      return platform;
    }
  }
}
