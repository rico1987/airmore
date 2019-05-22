import {
    Injectable,
    Inject,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ViewChild,
    ElementRef,
  } from '@angular/core';
import fecha from 'fecha';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { NzModalService } from 'ng-zorro-antd/modal';
import { MessageService } from './message.service';
import { CommonResponse } from '../../shared/models';


import { downloadLink } from '../../utils/tools';
import { DeviceService } from './device.service';
import { MyClientService } from './my-client.service';
import { BrowserStorageService } from './storage.service';
import { DynamicInputComponent } from '../../shared/components/dynamic-input/dynamic-input.component';
import { UploadFile } from '../../shared/components/dynamic-input/interfaces';
import { VideoPlayerComponent } from '../../shared/components/video-player/video-player.component';
import { ImageViewerComponent } from '../../shared/components/image-viewer/image-viewer.component';
import { NewFolderModalComponent } from '../../shared/components/new-folder-modal/new-folder-modal.component';

import { getFirstLetters } from '../../utils/index';

import { downloadText } from '../../utils/tools';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {

    activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard'  = 'contacts';

    sidebarItemList: Array<any> = [];

    itemList: Array<any> = [];

    itemGroupList: Array<any> = [];

    activeAlbumId: string;

    activeItem: any = null;

    activeNode: any = null;

    activeContact: any = null;

    selectedItems: Array<any> = []; // 选中的item

    activeViewMode:  'list' | 'grid' = 'list';

    isClipboardEditing: boolean = false;

    root: any = null;

    rootNodes: Array<any>;

    loading: boolean;

    Start = 0;

    Limit = 200;

    totalCount: number;

    tempContactsGroupList: Array<any> = [];

    contactLetterGroupList: Array<any>;

    allLetters: Array<string> = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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

    setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard'): void {
        if (fun !== this.activeFunction) {
            this.activeItem = null;
            this.activeNode = null;
            this.activeFunction = fun;
            this.getSidebarItemList();
        }
    }

    setItemList(itemList: Array<any>): void {
        this.itemList = itemList.concat();
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
                this.totalCount = this.sidebarItemList[0]['Count'];
                this.getItemList(false);
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
                    console.log(this.itemList);
                    this.loading = false;
                });
        } else if (this.activeFunction === 'messages') {
            this.deviceService.getMessageLatestList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    if (this.sidebarItemList.length > 0) {
                        this.activeAlbumId = this.sidebarItemList[0]['ID'];
                        this.totalCount = this.sidebarItemList[0]['Count'];
                        this.activeItem = this.sidebarItemList[0];
                        this.getItemList(false);
                    } else {
                        this.loading = false;
                    }
                    
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
        } else if (this.activeFunction === 'contacts') {
            this.deviceService.getContactGroupList()
                .subscribe((data) => {
                    this.tempContactsGroupList = data;
                    for(let i = 0, l = this.tempContactsGroupList.length; i < l; i++) {
                        this.tempContactsGroupList[i]['key'] = this.tempContactsGroupList[i]['ID'];
                        this.tempContactsGroupList[i]['label'] = this.tempContactsGroupList[i]['GroupName'];
                        this.tempContactsGroupList[i]['value'] = this.tempContactsGroupList[i]['ID']
                    }
                    this.getItemList(false);
                });
        }
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
        } else if (this.activeFunction === 'contacts') {
            this.deviceService.getAllContacts()
                .subscribe((data) => {
                    this.generateContactsData(data);
                });
        } else if (this.activeAlbumId) {
            if (this.activeFunction === 'pictures') {
                this.deviceService.getPhotoList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        console.log(this.itemGroupList);
                        this.loading = false;
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

    generateContactsData(data): void {
        this.sidebarItemList = [];
        const ungroupedContacts = [];
        const hasNumberContacts = [];
        this.contactLetterGroupList = [];
        for (let i = 0; i < this.allLetters.length; i++) {
            this.contactLetterGroupList.push({
                key: this.allLetters[i].toUpperCase(),
                contacts: []
            });
        }

        for (let i = 0, l = data.length; i < l; i++) {
            data[i]['letters'] = getFirstLetters(data[i]['Name']['DisplayName']);
            const firstLetter = data[i]['letters'][0][0].toUpperCase();
            
            const index = this.contactLetterGroupList.findIndex(ele => ele['key'] === firstLetter);

            if (index > -1) {
                this.contactLetterGroupList[index]['contacts'].push(data[i]);
            }

            if (data[i]['Phone'] && data[i]['Phone'].length > 0) {
                hasNumberContacts.push(data[i]);
            }
            if (!data[i]['Groups'] || data[i]['Groups'].length === 0) {
                ungroupedContacts.push(data[i]);
            }
            for (let j = 0, l = this.tempContactsGroupList.length; j < l; j++) {
                if (data[i]['Groups'] && data[i]['Groups'].length > 0) {
                    const index = this.tempContactsGroupList.findIndex(ele => data[i]['Groups'].some(group => group['GroupRowId'] === ele['ID']));
                    if (index > -1) {
                        if (this.tempContactsGroupList[index]['contacts']) {
                            this.tempContactsGroupList[index]['contacts'].push(data[i]);
                        } else {
                            this.tempContactsGroupList[index]['contacts'] = [data[i]];
                        }
                    }
                }
            }
        }
        this.sidebarItemList.push({
            ID: '0',
            GroupName: 'All Contacts',
            contacts: data,
        });
        this.sidebarItemList.push({
            ID: '-1',
            GroupName: 'Contacts with number',
            contacts: hasNumberContacts,
        });                                                                                    
        this.sidebarItemList.push({
            ID: '-2',
            GroupName: 'UngroupedContacts',
            contacts: ungroupedContacts,
        });
        this.sidebarItemList.push(...this.tempContactsGroupList);
        this.activeItem = this.sidebarItemList[0];
        this.activeContact = this.contactLetterGroupList[0]['contacts'][0];
        this.loading = false;                                                                            
    }

    /**
     * 设为壁纸
     * @param rotation 旋转
     */
    setAsWallpaper(rotation?: number): void {
        if (this.selectedItems[0] && this.selectedItems[0]['Path']) {
            this.deviceService.setAsWallpaper(this.selectedItems[0]['Path'], rotation)
                .subscribe((data) => {
                    if (data) {
                        this.messageService.success('设置壁纸成功')
                    } else {
                        this.messageService.error('设置壁纸失败');
                    }
                })
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
        console.log(this.itemGroupList);
    }

    newContact(): void {

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
        } else if (this.activeFunction === 'pictures') {
            key = 'PhotoDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: this.selectedItems,
            };
        } else if (this.activeFunction === 'musics') {
            key = 'MusicDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: this.selectedItems,
            }
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
        } else if (this.activeFunction === 'pictures') {
            key = 'PhotoDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: [item],
            };
        } else if (this.activeFunction === 'musics') {
            key = 'MusicDeleteMul';
            postData = {
                AlbumID: this.activeAlbumId,
                Data: [item],
            }
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
            if (item.FileType && item.FileType === 2) {
                downloadLink(this.deviceService.resolvePath(item.Path) + '?Export=1');
            } else {
                downloadLink(this.deviceService.resolvePath(item.Path) + '?Export=1');
            }
            
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
        setTimeout(() => {
            document.getElementsByTagName('textarea')[0].focus();
        }, 0);
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
        for (let i = 0, length = items.length; i < length; i++) {
            if (!this.hasItem(items[i])) {
                this.selectedItems.push(items[i]);
            }
        }
    }

    export() {
        if (this.activeFunction === 'clipboard') {
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                const fileName = `Clipboard_airmore_${fecha.format(new Date(), 'YY_MM_DD_h_m')}`;
                downloadText(this.selectedItems[i]['Content'], 'text/plain', fileName);
            }
        } else if (this.activeFunction === 'documents' || this.activeFunction === 'videos' || this.activeFunction === 'pictures' || this.activeFunction === 'musics' || this.activeFunction === 'files') {
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                this.download(this.selectedItems[i]);
            }
        }
    }

    /**
     * 预览图片
     */
    preview(item: any): void {
        const itemGroupList = this.itemGroupList, itemList = [];
        itemGroupList.forEach((ele) => {
            itemList.push(...ele.items);
        });
        itemList.forEach((ele) => {
            ele['image_thumb_url'] = this.deviceService.resolveThumbPath(ele.Path, 168, 168);
            ele['image_url'] = this.deviceService.resolvePath(ele.Path);
        });
        console.log(itemList);

        const componentRef = this.componentFactoryResolver
        .resolveComponentFactory(ImageViewerComponent)
        .create(this.injector);

        this.appRef.attachView(componentRef.hostView);

        const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

        componentRef.instance.uniqueKey = 'ID';
        componentRef.instance.imageList = itemList.concat();
        componentRef.instance.thumbKey = 'image_thumb_url';
        componentRef.instance.srcKey = 'image_url';
        componentRef.instance.onClose = () => {
        componentRef.destroy();
        document.body.removeChild(domElem);
        };
        
        document.body.appendChild(domElem);
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
        if (this.activeFunction === 'messages') {
            this.deviceService.getMessageList(item.ID, 0, item.Count)
                .subscribe(
                    (data) => {
                        if (data) {
                            this.itemList = data;
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
        } else if (this.activeFunction === 'contacts') {
            this.generateContactsData(this.activeItem['contacts']);
        }
    }
}
