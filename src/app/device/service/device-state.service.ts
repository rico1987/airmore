import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { DeviceService } from '../../shared/service/device.service';
import { AppStateService } from '../../shared/service/app-state.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {

    activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' = 'pictures';

    sidebarItemList: Array<any> = [];

    itemList: Array<any> = [];

    selectedItems: Array<any> = []; // 选中的item

    loading: false;

    constructor(
        private appStateService: AppStateService,
        private deviceService: DeviceService,
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) {
    }

    setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools'): void {
        if (fun !== this.activeFunction) {
            this.appStateService.setActiveFunction(fun);
            this.activeFunction = fun;
            this.getItemList();
        }
    }

    getItemList():void {}

    getSidebarItemList(): Observable<any> {
        if (this.activeFunction === 'pictures') {
            return this.deviceService.getPhotoAlbumList();
        }
    }

    refreshItemList(): void {}

    addItems(items: Array<any>): void {
        this.selectedItems.push(...items);
    }

    hasItem(item: any): boolean {
        return this.selectedItems.indexOf(item) > -1;
    }
}