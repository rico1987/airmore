import {
    Injectable,
    Inject,
    Injector,
    ApplicationRef,
    ComponentFactoryResolver,
    EmbeddedViewRef,
    ViewChild,
    ElementRef,
    ComponentRef,
  } from '@angular/core';
import fecha from 'fecha';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { MessageService } from './message.service';
import { ModalService } from './modal';
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
import { NewContactGroupModalComponent } from '../../shared/components/new-contact-group-modal/new-contact-group-modal.component';
import { ContactDetailComponent } from '../../device/components/contact-detail/contact-detail.component';

import { getFirstLetters } from '../../utils/index';

import { downloadText } from '../../utils/tools';
import { HttpResponse, HttpEventType } from '@angular/common/http';
const deepcopy = require('deepcopy');

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

    isAddingContact: boolean = false;

    isAddingMessage: boolean = false;

    root: any = null;

    rootNodes: Array<any>;

    loading: boolean;

    Start = 0;

    Limit = 200;

    totalCount: number;

    tempContactsGroupList: Array<any> = [];

    contactGroupList: Array<any>;

    contactLetterGroupList: Array<any>;

    selectedMessageReceivers: Array<any> = [];

    allLetters: Array<string> = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

    contactDetailRef: ElementRef<ContactDetailComponent>;

    // upload queue start

    uploadQueue: Array<any> = [];

    uploadQueueLength: number;

    uploadingItem: any;

    tempContactLetterGroupList: Array<any>;

    tempItemList: Array<any>;

    tempSidebarItemList: Array<any>;

    clipboardValue: string = '';

    processUploadQueue(): void {
        if (this.uploadQueue.length > 0) {
            this.uploadingItem = this.uploadQueue.shift();

            let key: string, directory: string = '';

            if (this.activeFunction === 'videos') {
                key = 'VideoImport';
            } else if (this.activeFunction === 'documents') {
                key = 'DocImport';
            } else if (this.activeFunction === 'musics') {
                key = 'MusicImport';
            } else if (this.activeFunction === 'files') {
                key = 'FileImport';
                if (this.activeNode) {
                    directory = this.activeNode.Path;
                }
            }
              this.deviceService.importFile(key, this.activeAlbumId, this.uploadingItem, directory)
                    .subscribe(
                        (data) => {
                        },
                        (error) => {
                            if (error) {
                                this.messageService.error('导入失败');
                            }
                        },
                        () => {
                            if (this.uploadQueue.length > 0) {
                                this.processUploadQueue();
                            } else {
                                this.messageService.success(`成功导入${this.uploadQueueLength}个文件`);
                                this.getItemList(false);
                            }
                        }
                    );
        }
    }
    // upload queue end

    constructor(
        private deviceService: DeviceService,
        private injector: Injector,
        private appRef: ApplicationRef,
        private componentFactoryResolver: ComponentFactoryResolver,
        private modalService: ModalService,
        private messageService: MessageService,
        private myClientService: MyClientService,
        private browserStorageService: BrowserStorageService,
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) {
    }

    filter(searchKey: string): void {
        if (!searchKey) {
            this.clearFilter();
            return;
        }
        if (this.activeFunction === 'contacts') {
            this.contactLetterGroupList = deepcopy(this.tempContactLetterGroupList);
               
            for(let i = 0, l = this.contactLetterGroupList.length; i < l; i++) {
                this.contactLetterGroupList[i]['contacts'] = this.contactLetterGroupList[i]['contacts'].filter((ele) => {
                    return ele['Name']['DisplayName'].indexOf(searchKey) > -1;
                })
            }
        } else if (this.activeFunction === 'messages') {
            this.sidebarItemList = deepcopy(this.tempSidebarItemList);

            this.sidebarItemList = this.sidebarItemList.filter((ele) => {
                return ele['ShowName'].indexOf(searchKey) > -1 || ele['Content'].indexOf(searchKey) > -1
            })
        } else if (this.activeFunction === 'documents' || this.activeFunction === 'apps' || this.activeFunction === 'files' || this.activeFunction === 'videos') {
            this.itemList = deepcopy(this.tempItemList);

            this.itemList = this.itemList.filter((ele) => {
                return ele['ShowName'].indexOf(searchKey) > -1;
            })
        } else if (this.activeFunction === 'clipboard') {
            this.itemList = deepcopy(this.tempItemList);
            this.itemList = this.itemList.filter((ele) => {
                return ele['Content'].indexOf(searchKey) > -1;
            })
        } else if (this.activeFunction === 'musics') {
            this.itemList = deepcopy(this.tempItemList);
            this.itemList = this.itemList.filter((ele) => {
                return ele['ShowName'].indexOf(searchKey) > -1 || ele['Artist'].indexOf(searchKey) > -1 || ele['Album'].indexOf(searchKey) > -1;
            })
        }
    }

    clearFilter(): void {
        if (this.activeFunction === 'contacts') {
            this.contactLetterGroupList = deepcopy(this.tempContactLetterGroupList);
        } else if (this.activeFunction === 'messages') {
            this.sidebarItemList = deepcopy(this.tempSidebarItemList);
        } else if (this.activeFunction === 'documents' || this.activeFunction === 'apps' || this.activeFunction === 'files' || this.activeFunction === 'clipboard' || this.activeFunction === 'videos' || this.activeFunction === 'musics') {
            this.itemList = deepcopy(this.tempItemList);
        }
    }

    setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard'): void {
        if (fun !== this.activeFunction) {
            this.activeItem = null;
            this.activeNode = null;
            this.activeFunction = fun;
            this.getSidebarItemList();
            if (fun === 'messages' && !this.contactGroupList) {
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
    }

    setItemList(itemList: Array<any>): void {
        this.itemList = itemList.concat();
        this.tempItemList = deepcopy(this.itemList);
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
                    this.tempItemList = deepcopy(this.itemList);
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
                    this.tempItemList = deepcopy(this.itemList);
                    this.activeItem = this.itemList.length > 0 ? this.itemList[0] : null;
                    this.loading = false;
                });
        } else if (this.activeFunction === 'messages') {
            this.deviceService.getMessageLatestList()
                .subscribe((data) => {
                    this.sidebarItemList = data;
                    this.tempSidebarItemList = deepcopy(this.sidebarItemList);
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
                    this.deviceService.getAllContacts()
                        .subscribe((data) => {
                            this.generateContactsData(data);
                        });
                });
        }
    }

    getItemList(isAddTo: boolean): void {
        this.loading = true;
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
                    setTimeout(() => {
                        this.loading = false;
                    }, 1000);
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
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'musics') {
                this.deviceService.getMusictList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        setTimeout(() => {
                            this.loading = false;
                        }, 1000);    
                    });
            } else if (this.activeFunction === 'documents') {
                this.deviceService.getDocList(this.activeAlbumId)
                    .subscribe((data) => {
                        for (let i = 0, l = data.length; i < l; i++) {
                            data[i]['album'] = this.activeAlbumId; 
                        }
                        this.itemList = data;
                        this.tempItemList = deepcopy(this.itemList);
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'videos') {
                this.deviceService.getVideoList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        this.loading = false;
                    });
            } else if (this.activeFunction === 'messages') {
                this.deviceService.getMessageList(this.activeAlbumId, this.Start, this.totalCount)
                    .subscribe((data) => {
                        this.processData(data, isAddTo);
                        this.loading = false;
                    });
            }
        }
    }

    generateContactLetterGroupList(data: Array<any>): void {
        if(!data) {
            this.contactLetterGroupList = [];
            return
        }
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
        }
    }

    generateContactsData(data): void {
        this.sidebarItemList = [];
        const ungroupedContacts = [];
        const hasNumberContacts = [];

        this.generateContactLetterGroupList(data);

        this.tempContactLetterGroupList = deepcopy(this.contactLetterGroupList);

        for (let i = 0, l = data.length; i < l; i++) {

            if (data[i]['Phone'] && data[i]['Phone'].length > 0) {
                hasNumberContacts.push(data[i]);
            }
            if (!data[i]['Groups'] || data[i]['Groups'].length === 0) {
                ungroupedContacts.push(data[i]);
            }
            for (let j = 0, l = this.tempContactsGroupList.length; j < l; j++) {
                if (data[i]['Groups'] && data[i]['Groups'].length > 0) {
                    if (data[i]['Groups'].some(group => group['GroupRowId'] === this.tempContactsGroupList[j]['ID'])) {
                        if (this.tempContactsGroupList[j]['contacts']) {
                            this.tempContactsGroupList[j]['contacts'].push(data[i]);
                        } else {
                            this.tempContactsGroupList[j]['contacts'] = [data[i]];
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
        this.contactGroupList = this.sidebarItemList.concat();
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
        if (this.activeFunction === 'messages') {
            this.itemList = this.itemList.reverse();
        }
        this.tempItemList = deepcopy(this.itemList);
    }

    newContact(): void {
        this.isAddingContact = true;
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
                this.tempItemList = deepcopy(this.itemList);
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
        if (this.activeFunction === 'contacts') {
            let contactsCount = 0;
            for (let i = 0, l = this.contactLetterGroupList.length; i < l; i++) {
                contactsCount += this.contactLetterGroupList[i]['contacts'].length;
            }
            if (this.selectedItems.length < contactsCount) {
                this.selectedItems = [];
                for (let i = 0, l = this.contactLetterGroupList.length; i < l; i++) {
                    this.addItems(this.contactLetterGroupList[i]['contacts']);
                }
            } else {
                this.selectedItems = []
            }
        } else {
            if (this.selectedItems.length < this.itemList.length) {
                this.selectedItems = this.itemList.concat();
            } else {
                this.selectedItems = [];
            }
        }
    }

    importFolder(): void {

    }

    importFile(): void {
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
            this.uploadQueue.push(...fileList);
            this.uploadQueueLength = fileList.length;
            this.processUploadQueue();
            this.appRef.detachView(componentRef.hostView);
            document.body.removeChild(domElem);
            componentRef.destroy();
        };

        componentRef.instance.onClick();
    }

    importContact(): void {
        
    }

    newFolder(): void {
        const newFolderModal = this.modalService.create({
            amTitle: 'New Folder',
            amContent: NewFolderModalComponent,
            amFooter: [
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
            amMaskClosable: false,
            amClosable: false,
            amOnOk: () => {
      
            }
          });
    }

    newContactGroup(): void {
        const newContactGroupModal = this.modalService.create({
            amTitle: '请输入分组名称',
            amContent: NewContactGroupModalComponent,
            amFooter: [
              {
                label: 'OK',
                onClick: componentInstance => {
                  newContactGroupModal.close();
                  const name = componentInstance.name;
                  if (!name) {
                    return;
                  }
                  this.deviceService.addGroup(name)
                    .subscribe(
                        (data: any) => {
                            if(data) {
                                this.messageService.success('添加成功');
                                this.getSidebarItemList();
                            } else {
                                this.messageService.error('添加失败');
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
            amMaskClosable: false,
            amClosable: false,
            amOnOk: () => {
      
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
            postData = this.selectedItems;
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
        } else if (this.activeFunction === 'contacts') {
            key = 'ContactDeleteMul';
            postData = this.selectedItems;
        }
        if (this.activeFunction === 'videos') {
            this.messageService.info('请在手机上确认删除');
            // todo 
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
                amTitle: '<i>Warning</i>',
                amContent: '<b>确定要删除这些记录吗？</b>',
                amOnOk: () => {
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
                amTitle: 'Warning',
                amContent: '确定要删除这条记录吗？',
                amOnOk: () => {
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
        if (this.selectedItems.length === 1) {
            this.backupSingleApp(this.selectedItems[0]);
        } else if (this.selectedItems.length > 1) {
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                this.backupSingleApp(this.selectedItems[i]);
            }
        }
    }

    backupSingleApp(item: any): void {
        downloadLink(this.deviceService.getAppLink(item));
    }

    /**
     * 下载item
     */
    download(item: any): void {
        console.log(item);
        if (item && item.Path) {
            if (item.FileType && item.FileType === 2) {
                if (this.deviceService.isSupportZipDownload()) {
                    this.deviceService.zipFileDownload(this.activeFunction, [item.Path]);
                } else {
                    this.messageService.error('不支持下载文件夹！');
                }
            } else {
                downloadLink(this.deviceService.resolvePath(item.Path) + '?Export=1');
            }
        }
    }

    uninstall(item?: any): void {
        this.modalService.confirm({
            amTitle: 'Warning',
            amContent: 'Do you Want to uninstall the app?',
            amOnOk: () => {
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
        this.selectedMessageReceivers = [];
        this.isAddingMessage = true;
    }

    copyToClipboard(): void {
        this.isClipboardEditing = true;
        setTimeout(() => {
            document.getElementsByTagName('textarea')[0].focus();
        }, 0);
    }

    saveClipboard(): void {
        if (this.clipboardValue) {
            this.deviceService.saveClipboard(this.clipboardValue)
                .subscribe(
                    (data: CommonResponse) => {
                        if (data) {
                            this.messageService.success('添加成功!');
                            this.clipboardValue = '';
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
        } else {
            this.messageService.error('内容不能为空！');
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
            const fileName = `Clipboard_airmore_${fecha.format(new Date(), 'YY_MM_DD_h_m')}`;
            let content = '';
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                content += this.selectedItems[i]['Content'] + '\n';
            }
            downloadText(content, 'text/plain', fileName);
        } else if (this.activeFunction === 'documents' ||
                this.activeFunction === 'videos' ||
                this.activeFunction === 'pictures' ||
                this.activeFunction === 'musics' ||
                this.activeFunction === 'files') {
            if (this.selectedItems.length === 1) {
                this.download(this.selectedItems[0]);
            } else if (this.selectedItems.length > 1) {
                if (this.deviceService.isSupportZipDownload()) {
                    const paths = [];
                    for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                        paths.push(this.selectedItems[i]['Path'] || this.selectedItems[i]['APPPath']);
                    }
                    this.deviceService.zipFileDownload(this.activeFunction, paths);
                } else {
                    for (let i = 0, l = this.selectedItems.length; i < l; i++) {
                        this.download(this.selectedItems[i]);
                    }
                }
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
            this.generateContactLetterGroupList(this.activeItem['contacts']);
        }
    }

    get isAllSelected(): boolean {
        if (this.activeFunction !== 'contacts') {
            return this.itemList.length === this.selectedItems.length;
        }
        if (!this.contactLetterGroupList) {
            return false
        } else {
            let count = 0;
            for (let i = 0, l = this.contactLetterGroupList.length; i < l; i++) {
                count += this.contactLetterGroupList[i]['contacts'].length;
            }
            return count === this.selectedItems.length;
        }   
    }
}
