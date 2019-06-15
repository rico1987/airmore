// 管理app全局状态
import { Injectable, Inject, ElementRef } from '@angular/core';
import {
    ConnectionPositionPair,
    FlexibleConnectedPositionStrategy,
    Overlay,
    OverlayConfig,
    OverlayRef
} from '@angular/cdk/overlay';
import { Router } from '@angular/router';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Logger } from './logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { CloudStateService } from './cloud-state.service';
import { BrowserStorageService } from './storage.service';
import { DeviceService } from './device.service';
import { ModalService } from './modal';
import { ComponentPortal } from '@angular/cdk/portal';
import { ConnectionComponent } from '../../shared/components/connection/connection.component';
import { ReflectorModalComponent } from '../components/reflector-modal/reflector-modal.component';
import { ComponentRef } from '@angular/core/src/render3';
import { ComponentInstance } from '@angular/core/src/render3/interfaces/player';
import { MessageService } from './message.service';

@Injectable({
    providedIn: 'root'
})
export class AppService {

    public accountRoute: 'passwordLogin' | 'resetPassword' | 'phonePasswordLess' | 'emailPasswordLess' | 'register' | 'logined' = 'passwordLogin'; // account 组件路由

    public currentLanguage: string; // 当前语言

    public currentModule: 'cloud' | 'device' = 'cloud'; // 当前模块

    public connectionInstance: ConnectionComponent; //  ComponentRef<ConnectionComponent>;    // connection component instance

    public reflectorInstance: ReflectorModalComponent;

    public searchKey: string = null;   // search key

    private _overlayRef: OverlayRef | null;

    constructor(
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
        private cloudStateService: CloudStateService,
        private storage: BrowserStorageService,
        private modalService: ModalService,
        private logger: Logger,
        private router: Router,
        private overlay: Overlay,
        private deviceService: DeviceService,
        private messageService: MessageService,
    ) {
        this.currentLanguage = this.appConfig.app.defaultLang;
        this.deviceService.on('DeviceDisconnect', () => {
            this.modalService.confirm({
                amTitle: 'Warning',
                amContent: '手机连接已断开，是否重新连接？',
                amOnOk: () => {
                    this.router.navigate(['/connect']);
                }
              });
        })
        this.deviceService.on('DeviceConnected', () => {
            this.hideConnection();
        })

        this.cloudStateService
    }

    // common popup start
    showConnection(connectionType: 'qrcode' | 'radar' | 'account' | null): void {
        this.dispose();
        this._overlayRef = this.overlay.create(
            new OverlayConfig({
                scrollStrategy: this.overlay.scrollStrategies.close(),
            })
        );
        this.connectionInstance = this._overlayRef.attach(new ComponentPortal(ConnectionComponent)).instance;
        this.connectionInstance.showInstallLink = false;
        if (connectionType) {
            this.connectionInstance.activeConnectionType = connectionType;
        }
        fromEvent<MouseEvent>(document, 'click')
            .pipe(
                filter(event => !!this._overlayRef && !this._overlayRef.overlayElement.contains(event.target as HTMLElement)),
                take(1)
            )
            .subscribe(() => this.connectionInstance.hide());
    }

    hideConnection(): void {
        if (this.connectionInstance) {
            this.connectionInstance.hide();
            this.connectionInstance = null;
        }
        this.dispose();
    }

    openReflector(): void {
        this.dispose();
        this._overlayRef = this.overlay.create(
            new OverlayConfig({
                positionStrategy: this.overlay.position().global().width('362px').height('725px').centerHorizontally().centerVertically(),
            }),
        )
        this.reflectorInstance = this._overlayRef.attach(new ComponentPortal(ReflectorModalComponent)).instance;
        this.reflectorInstance.onClose = () => this.dispose();
        this.reflectorInstance.onSaveToPhone = () => {
            this.deviceService.saveScreenshot()
                .subscribe((data) => {
                    if (data) {
                        this.messageService.success('截图成功');
                    }
                })
        };
        this.reflectorInstance.onFullScreen = (flag) => {
            debugger
            if(flag) {
                debugger
                this._overlayRef.updatePositionStrategy(
                    this.overlay.position().global().top('0').left('0').bottom('0').right('0'),
                );
                this._overlayRef.overlayElement.style.backgroundColor = 'black';
            } else {

            }
        }
    }

    dispose(): void {
        if (this._overlayRef) {
            this._overlayRef.dispose();
            this._overlayRef = null;
        }
    }

    // common popup end


    // common settings start
    setActiveViewMode(mode: 'list' | 'grid'): void {
        if (this.currentModule === 'cloud') {
            this.cloudStateService.setActiveViewMode(mode);
        } else if (this.currentModule === 'device') {
            this.deviceService.setActiveViewMode(mode);
        }
    }

    setCurrentLang(lang: string): void {
        this.currentLanguage = lang;
    }

    setCurrentModule(module: 'cloud' | 'device'): void {
        this.currentModule = module;
    }
    // common settings start


    // common actions start
    filter(): void {
        if (this.currentModule === 'device') {
            this.deviceService.filter(this.searchKey);
        } else if (this.currentModule === 'cloud') {
            this.cloudStateService.filter(this.searchKey);
        }
    }

    clearFilter(): void {
        this.searchKey = null;
        if (this.currentModule === 'device') {
            this.deviceService.clearFilter();
        } else if (this.currentModule === 'cloud') {
            this.cloudStateService.clearFilter();
        }
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
                    this.deviceService.refreshItemList();
                }
                break;
            case 'new-folder':
                if (this.currentModule === 'cloud') {
                    this.cloudStateService.newFolder()
                } else if (this.currentModule === 'device') {
                    this.deviceService.newFolder();
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
                    this.deviceService.selectAll();
                }
                break;
            case 'delete':
                if (this.currentModule === 'cloud') {
                    this.cloudStateService.deleteItems();
                } else if (this.currentModule === 'device') {
                    if (this.deviceService.activeFunction === 'apps') {
                        this.deviceService.uninstall()
                    } else if (this.deviceService.activeFunction === 'clipboard' ||
                        this.deviceService.activeFunction === 'documents' ||
                        this.deviceService.activeFunction === 'videos' ||
                        this.deviceService.activeFunction === 'files' ||
                        this.deviceService.activeFunction === 'pictures' ||
                        this.deviceService.activeFunction === 'contacts' ||
                        this.deviceService.activeFunction === 'musics') {
                        this.deviceService.deleteItems();
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
                    // this.deviceService.upload();
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
                    this.deviceService.backupApps();
                }
                break;
            case 'install':
                this.deviceService.install();
                break;
            case 'export':
                if (this.currentModule === 'device') {
                    this.deviceService.export();
                } else if (this.currentModule === 'cloud') {
                    this.cloudStateService.export();
                }
                break;
            case 'copy-to-clipboard':
                if (this.currentModule === 'device') {
                    this.deviceService.copyToClipboard();
                }
                break;
            case 'new-message':
                this.deviceService.newMessage();
                break;
            case 'set-as-wallpaper':
                this.deviceService.setAsWallpaper();
                break;
            case 'new-contact':
                this.deviceService.newContact();
                break;
            case 'import-contact':
                this.deviceService.importContact();
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
                    flag = this.cloudStateService.activeFunction === 'clouds';
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
                    flag = this.deviceService.activeFunction === 'files';
                    break;
                case 'refresh':
                    flag = true;
                    break;
                case 'select-all':
                    flag = this.deviceService.activeFunction !== 'messages';
                    break;
                case 'delete':
                    flag = this.deviceService.activeFunction !== 'messages';
                    break;
                case 'import':
                    flag = this.deviceService.activeFunction === 'pictures' ||
                        this.deviceService.activeFunction === 'videos' ||
                        this.deviceService.activeFunction === 'musics' ||
                        this.deviceService.activeFunction === 'documents' ||
                        this.deviceService.activeFunction === 'files';
                    break;
                case 'export':
                    flag = this.deviceService.activeFunction === 'pictures' ||
                        this.deviceService.activeFunction === 'videos' ||
                        this.deviceService.activeFunction === 'musics' ||
                        this.deviceService.activeFunction === 'documents' ||
                        this.deviceService.activeFunction === 'clipboard' ||
                        this.deviceService.activeFunction === 'files' ||
                        this.deviceService.activeFunction === 'contacts';
                    break;
                case 'install':
                    flag = this.deviceService.activeFunction === 'apps';
                    break;
                case 'backup':
                    flag = this.deviceService.activeFunction === 'apps';
                    break;
                case 'copy-to-clipboard':
                    flag = this.deviceService.activeFunction === 'clipboard';
                    break;
                case 'new-message':
                    flag = this.deviceService.activeFunction === 'messages';
                    break;
                case 'set-as-wallpaper':
                    flag = this.deviceService.activeFunction === 'pictures';
                    break;
                case 'new-contact':
                case 'import-contact':
                    flag = this.deviceService.activeFunction == 'contacts';
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
                    (this.currentModule === 'device' && this.deviceService.selectedItems.length === 0);
                break;
            case 'rename':
                flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length !== 1) ||
                    (this.currentModule === 'device' && this.deviceService.selectedItems.length !== 1);
                break;
            case 'backup':
                flag = this.currentModule === 'device' && this.deviceService.selectedItems.length === 0;
                break;
            case 'delete':
                flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length === 0) ||
                    (this.currentModule === 'device' && this.deviceService.activeFunction === 'apps' && this.deviceService.selectedItems.length !== 1) ||
                    (this.currentModule === 'device' && this.deviceService.activeFunction !== 'apps' && this.deviceService.selectedItems.length === 0)
                break;
            case 'export':
                flag = (this.currentModule === 'cloud' && this.cloudStateService.selectedItems.length !== 1) ||
                    (this.currentModule === 'device' && this.deviceService.selectedItems.length === 0);
                break;
            case 'set-as-wallpaper':
                flag = (this.currentModule === 'device' && this.deviceService.selectedItems.length !== 1)
                break;
        }
        return flag;
    }
    // common actions end



    // status getters start
    get isDebug() {
        return this.appConfig.app.isDebug;
    }

    get isEmpty(): boolean {
        if (this.currentModule === 'cloud') {
            return this.cloudStateService.itemList.length === 0;
        } else if (this.currentModule === 'device') {
            return this.deviceService.itemList.length === 0;
        }
    }

    get loading(): boolean {
        if (this.currentModule === 'cloud') {
            return this.cloudStateService.loading;
        } else if (this.currentModule === 'device') {
            return this.deviceService.loading || this.deviceService.loadingItems;
        }
        return false;
    }

    get isAllSelected(): boolean {
        if (this.currentModule === 'cloud') {
            return this.cloudStateService.isAllSelected;
        } else if (this.currentModule === 'device') {
            return this.deviceService.isAllSelected;
        }
    }

    get activeFunction(): any {
        if (this.currentModule === 'cloud') {
            return 'cloud';
        } else if (this.currentModule === 'device') {
            return this.deviceService.activeFunction;
        }
    }

    get activeViewMode(): string {
        if (this.currentModule === 'cloud') {
            return this.cloudStateService.activeViewMode;
        } else if (this.currentModule === 'device') {
            return this.deviceService.activeViewMode;
        }
    }
    // status getters end
}