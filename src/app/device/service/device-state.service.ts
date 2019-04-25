import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { DeviceService } from '../../shared/service/device.service';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {

    activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' |
    'clipboard' | 'tools' = 'pictures';

    sidebarItemList: Array<any> = [];

    itemList: Array<any> = [];

    itemGroupList: Array<any> = [];

    activeAlbumId: string;

    selectedItems: Array<any> = []; // 选中的item

    loading: false;

    Start = 0;

    Limit = 200;

    constructor(
        private deviceService: DeviceService,
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) {
    }

    setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' |
     'clipboard' | 'tools'): void {
        if (fun !== this.activeFunction) {
            this.activeFunction = fun;
            this.getSidebarItemList();
        }
    }

    getItemList(isAddTo: boolean): void {
        if (this.activeAlbumId) {
            if (this.activeFunction === 'pictures') {
                this.deviceService.getPhotoList(this.activeAlbumId, this.Start, this.Limit)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                    });
            } else if (this.activeFunction === 'musics') {
                this.deviceService.getMusictList(this.activeAlbumId, this.Start, this.Limit)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                    });
            } else if (this.activeFunction === 'documents') {
                this.deviceService.getDocList(this.activeAlbumId)
                    .subscribe((data) => {
                        this.itemList = data;
                        console.log(this.itemList);
                    });
            }
        }
    }

    /**
     * 处理返回的数据
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
     */
    groupItems(itemList: Array<any>, key: string): Array<any> {
        const groupList: Array<any> = [];
        for (let i = 0; i < itemList.length; i = i + 1) {
            if (key === 'CreateTime') {
                const index = groupList.findIndex((ele) => ele['key'] === itemList[i][key].split(' ')[0]);
                if (index > -1) {
                    groupList[index].items.push(itemList[i]);
                } else {
                    groupList.push({
                        key: itemList[i][key].split(' ')[0],
                        items: [itemList[i]],
                    });
                }
            }
        }
        return groupList;
    }

    getSidebarItemList(): void {
        this.resetPaging();
        if (this.activeFunction === 'pictures') {
            this.deviceService.getPhotoAlbumList()
            .subscribe((data) => {
                this.sidebarItemList = data;
                this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
              });
        } else if (this.activeFunction === 'musics') {
            this.deviceService.getMusicAlbumList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'videos') {
            this.deviceService.getVideoAlbumList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'apps') {
            this.activeAlbumId = 'apps';
            this.deviceService.getAppList()
                .subscribe((data) => {
                    this.itemList = data;
                });
        } else if (this.activeFunction === 'documents') {
            this.deviceService.getDocAlbumList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'clipboard') {
            this.activeAlbumId = 'clipboard';
            this.deviceService.getClipboardList(this.activeAlbumId)
                .subscribe((data) => {
                    this.itemList = data;
                });
        }
    }

    refreshItemList(): void {
        this.resetPaging();
        // todo
    }

    selectAll(): void {
        this.selectedItems = this.itemList.concat();
    }

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

    resetPaging(): void {
        this.Start = 0;
        this.Limit = 50;
    }
}
