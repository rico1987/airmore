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

    itemGroupList: Array<any> = [];

    activeAlbumId: string;

    selectedItems: Array<any> = []; // 选中的item

    loading: false;

    Start: number = 0;

    Limit: number = 200;

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
            this.getItemList(false);
        }
    }

    getItemList(isAddTo: boolean):void {
        if (this.activeAlbumId) {
            if (this.activeFunction === 'pictures') {
                this.deviceService.getPhotoList(this.activeAlbumId, this.Start, this.Limit)
                    .subscribe((data) => { 
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                    });
            }
        }
    }

    /**
     * 处理返回的数据
     * @param data 
     */
    processData(data: any, isAddTo: boolean): void {
        let processedGroupList: Array<any> = [];
        if (this.activeFunction === 'pictures') {
            processedGroupList = this.groupItems(data, 'CreateTime');
        }
        if (isAddTo) {
            this.itemList = this.itemList.concat(data);
            this.itemGroupList = this.itemGroupList.concat(processedGroupList);
        } else {
            this.itemList = data;
            this.itemGroupList = processedGroupList;
        }
    }

    /**
     * 对list进行分组
     * @param itemList 
     * @param key 
     */
    groupItems(itemList: Array<any>, key: string): Array<any> {
        let groupList: Array<any> = [];
        for (let i = 0; i < itemList.length; i = i + 1) {
            if (key === 'CreateTime') {
                let index = groupList.findIndex((ele) => ele['key'] === itemList[i][key].split(' ')[0]);
                if (index > -1) {
                    groupList[index].items.push(itemList[i]);
                } else {
                    groupList.push({
                        key: itemList[i][key].split(' ')[0],
                        items: [itemList[i]],
                    })
                }
            }
        }
        return groupList;
    }

    getSidebarItemList(): void {
        if (this.activeFunction === 'pictures') {
            this.deviceService.getPhotoAlbumList()
            .subscribe((data) => { 
                this.sidebarItemList = data;
              });
        }
    }

    refreshItemList(): void {}

    addItems(items: Array<any>): void {
        this.selectedItems.push(...items);
    }

    hasItem(item: any): boolean {
        return this.selectedItems.indexOf(item) > -1;
    }

    selectAlbum(id: string): void { 
        if (id !== this.activeAlbumId) {
            this.activeAlbumId = id;
            this.getItemList(false);
        }
    }
}