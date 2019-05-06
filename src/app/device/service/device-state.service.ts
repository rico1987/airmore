import {
    Injectable,
    Inject,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
  } from '@angular/core';
import { Observable } from 'rxjs';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageService } from '../../shared/service/message.service';
import { CommonResponse } from '../../shared/models/common-response.model';

import { downloadLink } from '../../utils/tools';
import { DeviceService } from '../../shared/service/device.service';
import { MyClientService } from '../../shared/service/my-client.service';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { DynamicInputComponent } from '../../shared/components/dynamic-input/dynamic-input.component';
import { UploadFile } from '../../shared/components/dynamic-input/interfaces';


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

    activeViewMode:  'list' | 'grid' = 'list';

    loading: boolean;

    Start = 0;

    Limit = 200;

    totalCount: number;

    constructor(
        private deviceService: DeviceService,
        private injector: Injector,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private modalService: NzModalService,
        private messageService: MessageService,
        private myClientService: MyClientService,
        private browserStorageService: BrowserStorageService,
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
                this.deviceService.getMusictList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'documents') {
                this.deviceService.getDocList(this.activeAlbumId)
                    .subscribe((data) => {
                        this.itemList = data;
                        console.log(this.itemList);
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'videos') {
                this.deviceService.getVideoList(this.activeAlbumId, this.Start, this.Limit)
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
        this.loading = true;
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
                    this.totalCount = this.sidebarItemList[0]['Count'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'videos') {
            this.deviceService.getVideoAlbumList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
                    this.totalCount = this.sidebarItemList[0]['Count'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'apps') {
            this.activeAlbumId = 'apps';
            this.deviceService.getAppList()
                .subscribe((data) => {
                    this.itemList = data;
                    console.log(this.itemList)
                    this.loading = false;
                });
        } else if (this.activeFunction === 'documents') {
            this.deviceService.getDocAlbumList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
                    this.totalCount = this.sidebarItemList[0]['Count'];
                    this.getItemList(false);
                });
        } else if (this.activeFunction === 'clipboard') {
            this.activeAlbumId = 'clipboard';
            this.deviceService.getClipboardList(this.activeAlbumId)
                .subscribe((data) => {
                    this.itemList = data;
                    this.loading = false;
                });
        }
    }

    refreshItemList(): void {
        this.resetPaging();
        // todo
    }

    selectAll(): void {
        if (this.selectedItems.length < this.itemList.length) {
            this.selectedItems = this.itemList.concat();
        } else {
            this.selectedItems = [];
        }
    }

    rename(): void {
        
    }

    backupApps(): void {
        if (this.selectedItems.length === 0) {
            return;
        }
        for (let i = 0; i < this.selectedItems.length; i++) {
            this.backupSingleApp(this.selectedItems[i]);
        }
    }

    backupSingleApp(item: any): void {
        downloadLink(this.deviceService.getAppLink(item));
    }

    /**
     * 下载item
     */
    download(item: any): void {
    }

    uninstall(item?: any): void {
        this.modalService.confirm({
            nzTitle: '<i>Warning</i>',
            nzContent: '<b>Do you Want to uninstall the app?</b>',
            nzOnOk: () => {
              let arr;
              if (item) {
                  arr = [item];
              } else {
                  arr = this.selectedItems;
              }
              this.deviceService.uninstall(arr)
                .subscribe(
                  (data: CommonResponse) => {
                    if (data) {
                        this.messageService.info('请在手机上确认卸载!');
                    }
                  },
                  (error) => {
                    if (error) {
                      this.messageService.error('Uninstall failed!');
                    }
                  },
                  () => {
                  }
                );
            }
          });
    }

    install(): void {
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(DynamicInputComponent)
            .create(this.injector);
    
        componentRef.instance.options = {
            multiple: false,
        };
        
        this.appRef.attachView(componentRef.hostView);
    
        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
            .rootNodes[0] as HTMLElement;
        
        document.body.appendChild(domElem);
    
        componentRef.instance.onFileChange = (fileList: UploadFile[]) => {
            const apkFile = fileList[0];
            this.deviceService.install(apkFile)
            .subscribe(
                (data: CommonResponse) => {
                    if (data) {
                        this.messageService.info('请在手机上确认安装!');
                    }
                },
                  (error) => {
                    if (error) {
                    }
                  },
                  () => {
                    this.loading = false;
                  }
            )
        };
    
        componentRef.instance.onClick();
    }

    addItems(items: Array<any>): void {
        this.selectedItems.push(...items);
    }

    
    /**
     * 将items数组里的对象从已选择数组里移除
     */
    removeItems(items: Array<any>): void {
        for (let i = 0, length = items.length; i < length; i++) {
            const index = this.selectedItems.indexOf(items[i]);
            if (index > -1) {
                this.selectedItems.splice(index, 1);
            }
        }
    }

    hasItem(item: any): boolean {
        return this.selectedItems.indexOf(item) > -1;
    }

    selectAlbum(item): void {
        if (item['AlbumID'] !== this.activeAlbumId) {
            this.activeAlbumId = item['AlbumID'];
            this.totalCount = item['Count'];
            this.getItemList(false);
        }
    }

    resetPaging(): void {
        this.Start = 0;
        this.Limit = 50;
    }

    setActiveViewMode(activeViewMode:  'list' | 'grid'): void {
        this.activeViewMode = activeViewMode;
    }
}
