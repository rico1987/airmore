import {
    Injectable,
    Inject,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
  } from '@angular/core';
import { Observable } from 'rxjs';
import fecha from 'fecha';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageService } from '../../shared/service/message.service';
import { CommonResponse } from '../../shared/models/common-response.model';
import { NewFolderModalComponent } from '../../shared/components/new-folder-modal/new-folder-modal.component';


import { downloadLink } from '../../utils/tools';
import { DeviceService } from '../../shared/service/device.service';
import { MyClientService } from '../../shared/service/my-client.service';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { DynamicInputComponent } from '../../shared/components/dynamic-input/dynamic-input.component';
import { UploadFile } from '../../shared/components/dynamic-input/interfaces';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';

import { downloadText } from '../../utils/tools';

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

    activeItem: any = null;

    activeNode: any = null;

    selectedItems: Array<any> = []; // 选中的item

    activeViewMode:  'list' | 'grid' = 'list';

    isClipboardEditing: boolean = false;

    root: any = null;

    rootNodes: Array<any>;

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

    setItemList(itemList: Array<any>): void {
        this.itemList = itemList.concat();
    }

    getItemList(isAddTo: boolean): void {
        this.resetSelected();
        if (this.activeFunction === 'files') {
            let path;
            if (this.activeNode.origin) {
                path = this.activeNode.origin.Path;
            } else {
                path = this.activeNode.Path;
            }
            this.deviceService.getDirectoryFiles(path)
                .subscribe((data) => {
                    this.itemList = data;
                })
        } else if (this.activeAlbumId) {
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
                this.deviceService.getVideoList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'messages') {
                this.deviceService.getMessageList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemList);
                        console.log(this.itemGroupList);
                        this.loading = false;
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
        this.resetSelected();
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
                    console.log(data);
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
                    console.log(this.itemList);
                    this.loading = false;
                });
        } else if (this.activeFunction === 'messages') {
            this.deviceService.getMessageLatestList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.activeAlbumId = this.sidebarItemList[0]['ID'];
                    this.totalCount = this.sidebarItemList[0]['Count'];
                    this.getItemList(false);
                })
        } else if (this.activeFunction === 'files') {
            this.deviceService.getRootFileList()
                .subscribe((data) => {
                    this.root = this.transferToNodes(data).find((ele) => ele.ShowName === 'SDCard');
                    if (this.root) {
                        this.rootNodes = [this.root];
                        this.activeNode = this.root;
                        this.getRootSubFolders();
                    }
                });
        }

    }

    transferToNodes(arr): Array<any> {
        for (let i = 0, l = arr.length; i < l; i++) {
            arr[i]['isLeaf'] = arr[i]['FileType'] === 1;
            arr[i]['key'] = arr[i]['Path'];
        }
        return arr;
    }
    
    getRootSubFolders(): void {
        this.deviceService.getDirectoryFiles(this.root.Path)
            .subscribe((data) => {
                this.itemList = data;
                this.loading = false;
            });
    }

    refreshItemList(): void {
        this.resetPaging();
        if (this.activeFunction !== 'apps' && this.activeFunction !== 'clipboard') {
            this.getItemList(false);
        } else {
            this.getSidebarItemList();
        }
    }

    selectAll(): void {
        if (this.selectedItems.length < this.itemList.length) {
            this.selectedItems = this.itemList.concat();
        } else {
            this.selectedItems = [];
        }
    }

    import(): void {
        let key: string;

        if (this.activeFunction === 'videos') {
            key = 'VideoImport';
        }
        const componentRef = this.componentFactoryResolver
            .resolveComponentFactory(DynamicInputComponent)
            .create(this.injector);

        componentRef.instance.options = {
            multiple: true,
        };
        
        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;
        
        document.body.appendChild(domElem);

        componentRef.instance.onFileChange = (fileList: UploadFile[]) => {
            for(let i = 0, l = fileList.length; i < l; i++) {
                this.deviceService.importFile(key, this.activeAlbumId, fileList[i])
                    .subscribe(
                        (data) => {
                            if (data && data.Success === 1) {
                                this.messageService.success(`${data.Data[0].ShowName}导入成功！`)
                                this.getItemList(false);
                            } else {
                                this.messageService.error('导入失败');
                            }
                        },
                        (error) => {
                            if (error) {
                            }
                        },
                        () => {
                            this.isClipboardEditing = false;
                        }
                    );
            }
        };

        componentRef.instance.onClick();
    }

    newFolder(): void {
        const newFolderModal = this.modalService.create({
            nzTitle: '<i>New Folder</i>',
            nzContent: NewFolderModalComponent,
            nzFooter: [
              {
                label: 'OK',
                onClick: componentInstance => {
                  newFolderModal.close();
                  const name = componentInstance.name;
                  if (!name) {
                    return;
                  }

                  let directory;
                  if (this.activeNode) {
                    directory = this.activeNode.origin.Path;
                  } else {
                    directory = this.root.Path;
                  }
                  const folder = {
                    Directory: directory,
                    DirName: name,
                  };
                  this.loading = true;
                  this.deviceService.createDirectory([folder])
                    .subscribe(
                        (data: CommonResponse) => {
                            if(data.status === '1') {
                                this.messageService.success('添加成功');
                                this.refreshItemList();
                            }
                        },
                        (error) => {
                            if (error) {
                                this.messageService.error('添加失败');
                            }
                        },
                        () => {
                            this.loading = false;
                        }
                    )
                }
              }
            ],
            nzMaskClosable: false,
            nzClosable: false,
            nzOnOk: () => {
      
            }
          });
    }

    playVideo(item): void {
        if (item) {
            const componentRef = this.componentFactoryResolver
                .resolveComponentFactory(VideoPlayerComponent)
                .create(this.injector);
        
            componentRef.instance.videoSrc = this.deviceService.resolvePath(item.Path);
            componentRef.instance.title = item.ShowName;
            componentRef.instance.onClose = () => {
                const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
                .rootNodes[0] as HTMLElement;
                document.body.removeChild(domElem);
                componentRef.destroy();
            };
            
            this.appRef.attachView(componentRef.hostView);
        
            const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
                .rootNodes[0] as HTMLElement;
            
            document.body.appendChild(domElem);
        }

    }


    deleteItems(): void {
        // todo
        let key: string, postData: any;
        if (this.activeFunction === 'clipboard') {
            key = 'ClipboardDeleteMul';
            postData = this.selectedItems;
        } else if (this.activeFunction === 'documents') {
            key = 'DocDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: this.selectedItems,
            }
        } else if (this.activeFunction === 'videos') {
            key = 'VideoDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: this.selectedItems,
            }
        } else if (this.activeFunction === 'files') {
            key = 'FileDelete';
            postData = this.selectedItems;
        }
        if (this.activeFunction === 'videos') {
            this.messageService.info('请在手机上确认删除');
            this.deviceService.deleteItems(key, postData)
            .subscribe(
                (data: CommonResponse) => {
                    if (data) {
                        this.messageService.success('删除成功!');
                        this.refreshItemList();
                    } else {
                        this.messageService.error('删除失败');
                    }
                },
                (error) => {
                    if (error) {
                        this.messageService.error('删除失败');
                    }
                },
                () => {
                }
            );
        } else {
            this.modalService.confirm({
                nzTitle: '<i>Warning</i>',
                nzContent: '<b>确定要删除这些记录吗？</b>',
                nzOnOk: () => {
                    this.deviceService.deleteItems(key, postData)
                        .subscribe(
                            (data: CommonResponse) => {
                                if (data) {
                                    this.messageService.success('删除成功!');
                                    this.refreshItemList();
                                } else {
                                    this.messageService.error('删除失败');
                                }
                            },
                            (error) => {
                                if (error) {
                                    this.messageService.error('删除失败！');
                                }
                            },
                            () => {
                            }
                        );
                }
            });
        }
   
    }

    deleteItem(item: any): void {
        // todo
        let key: string, postData: any;
        if (this.activeFunction === 'documents') {
            key = 'DocDeleteMul';
            postData = [item];
        } else if (this.activeFunction === 'videos') {
            key = 'VideoDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: [item],
            }
        } else if (this.activeFunction === 'files') {
            key = 'FileDelete';
            postData = [item];
        }
        if (this.activeFunction === 'videos') {
            this.messageService.info('请在手机上确认删除');
            this.deviceService.deleteItems(key, postData)
            .subscribe(
                (data: CommonResponse) => {
                    if (data) {
                        this.messageService.success('删除成功!');
                        this.refreshItemList();
                    } else {
                        this.messageService.error('删除失败');
                    }
                },
                (error) => {
                    if (error) {
                        this.messageService.error('删除失败');
                    }
                },
                () => {
                }
            );
        } else {
            this.modalService.confirm({
                nzTitle: '<i>Warning</i>',
                nzContent: '<b>确定要删除这条记录吗？</b>',
                nzOnOk: () => {
                    this.deviceService.deleteItems(key, postData)
                        .subscribe(
                            (data: CommonResponse) => {
                                if (data) {
                                    this.messageService.success('删除成功!');
                                    this.refreshItemList();
                                }
                            },
                            (error) => {
                                if (error) {
                                    this.messageService.error('删除失败');
                                }
                            },
                            () => {
                            }
                        );
                }
              });
        }
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
        if (item && item.Path) {
            downloadLink(this.deviceService.resolvePath(item.Path) + '?Export=1');
        }
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

    newMessage(): void {
        
    }

    copyToClipboard(): void {
        this.isClipboardEditing = true;
    }

    saveClipboard(text: string): void {
        if (text) {
            this.deviceService.saveClipboard(text)
                .subscribe(
                    (data: CommonResponse) => {
                        if (data) {
                            this.messageService.success('添加成功!');
                            this.refreshItemList();
                        }
                    },
                    (error) => {
                        if (error) {
                            this.messageService.error('添加失败!');
                        }
                    },
                    () => {
                        this.isClipboardEditing = false;
                    }
                );
        }
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

    export() {
        if (this.activeFunction === 'clipboard') {
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                const fileName = `Clipboard_airmore_${fecha.format(new Date(), 'YY_MM_DD_h_m')}`;
                downloadText(this.selectedItems[i]['Content'], 'text/plain', fileName);
            }
        } else if (this.activeFunction === 'documents' || this.activeFunction === 'videos') {
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                this.download(this.selectedItems[i]);
            }
        }
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

    resetSelected(): void {
        this.selectedItems = [];
    }

    setActiveViewMode(activeViewMode:  'list' | 'grid'): void {
        this.activeViewMode = activeViewMode;
    }

    setActiveItem(item: any): void {
        this.activeItem = item;
    }
}
