import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {

    activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools';

    itemList: Array<any> = [];

    selectedItems: Array<any> = []; // 选中的item

    loading: false;

    constructor(
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) {
    }

    setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools'): void {
        if (fun !== this.activeFunction) {
            this.activeFunction = fun;
            this.getItemList();
        }
    }

    getItemList():void {}

    refreshItemList(): void {}
}