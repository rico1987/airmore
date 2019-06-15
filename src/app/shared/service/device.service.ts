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
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { CommonResponse } from '../../shared/models';

import { HttpClient, HttpHeaders, HttpProgressEvent, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { MyClientService } from './my-client.service';
import { DeviceInfo } from '../models/device-info.model';
import { getIp } from '../../utils/tools';
import { MessageService } from '../service/message.service';
import { generateRandomString, getDocTye, isDocument } from '../../utils/index';
import { ModalService } from '../service/modal';
import { ReflectorModalComponent } from '../components/reflector-modal/reflector-modal.component';


import { downloadLink } from '../../utils/tools';
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
import { map, tap, last, catchError } from 'rxjs/operators';
const deepcopy = require('deepcopy');

const fecha = require('fecha');

const hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];


const ContactTemplate = {
  Name: {
      DisplayName: '',
  },
  Portrait: {
      Data: '',
  },
  GroupSelect: [],
  Organization: [{
    Company: '',
    Job: '',
  }],
  Phone: [],
  Address: [],
  Email: [],
  IM: [],
  Website: [],
  Event: [],
  Note: [{
    Content: '',
  }]
};

const Operators = {
  1: 'Add',
  2: 'Update',
  3: 'Delete'
};

const fileExtensions = {
  'pictures': ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'pic', 'tif'],
  'musics': ['wav', 'aif', 'au', 'mp3', 'ram', 'wma', 'mmf', 'amr', 'aac', 'flac'],
  'videos': ['mp4', 'm4v', '3gp', '3g2', 'mov', 'flv', 'f4v', 'avi', 'mpeg', 'mpg', 'wmv', 'asf', 'vob', 'mkv', 'rmvb', 'webm', 'mts', 'ts'],
  'contacts': ['xml'],
  'apps': ['apk'],
  'documents': ['doc', 'docx', 'xls', 'xlsx', 'txt', 'pdf', 'ppt', 'pptx', 'zip'],
}


@Injectable({
  providedIn: 'root'
})
export class DeviceService extends WebsocketService {

  public deviceConnected = false; // is device connected

  activeFunction: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard' = 'contacts'; // device active function

  sidebarItemList: Array<any> = [];  // device sidebar items

  itemList: Array<any> = [];  // device item list

  itemGroupList: Array<any> = []; 

  activeAlbumId: string;

  activeItem: any = null;

  activeNode: any = null;

  activeContact: any = null;

  selectedItems: Array<any> = []; // 选中的item

  activeViewMode: 'list' | 'grid' = 'list';

  isClipboardEditing: boolean = false;

  isAddingContact: boolean = false;

  editingContact: any;

  isAddingMessage: boolean = false;

  root: any = null;

  rootNodes: Array<any>;

  loading: boolean;

  loadingItems: boolean;

  Start = 0;

  Limit = 200;

  totalCount: number;

  tempContactsGroupList: Array<any> = [];

  contactGroupList: Array<any>;

  contactGroupDetailList: Array<any>;

  contactLetterGroupList: Array<any>;

  selectedMessageReceivers: Array<any> = [];

  allLetters: Array<string> = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  allContacts: Array<any> = []

  contactDetailRef: ElementRef<ContactDetailComponent>;

  // upload queue start
  uploadQueue: Array<any> = [];

  uploadQueueLength: number;

  uploadingItem: any;

  isUploading: boolean = false;
  // upload queue end

  tempContactLetterGroupList: Array<any>;

  tempItemList: Array<any>;

  tempSidebarItemList: Array<any>;

  clipboardValue: string = '';


  constructor(
    private http: HttpClient,
    private browserStorageService: BrowserStorageService,
    private myClientService: MyClientService,
    private router: Router,
    private log: Logger,
    private messageService: MessageService,
    private modalService: ModalService,
    private injector: Injector,
    private appRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    super(log);
    this.activeConnectionType = 'qrcode';
  }

  private _activeConnectionType: 'qrcode' | 'radar' | 'account';
  public get activeConnectionType(): 'qrcode' | 'radar' | 'account' {
    return this._activeConnectionType;
  }
  public set activeConnectionType(value: 'qrcode' | 'radar' | 'account') {
    this._activeConnectionType = value;
  }

  init() {
    super.init();
    // this.checkAuthorization();
  }

  setDeviceActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard'): void {
    if (fun !== this.activeFunction) {
      this.activeItem = null;
      this.activeNode = null;
      this.activeFunction = fun;
      this.uploadQueue = [];
      this.getSidebarItemList();
      if (fun === 'messages' && !this.contactGroupList) {
        this.getAllContacts()
          .subscribe((data) => {
            this.allContacts = data;
            this.generateContactGroupDetailList(data);
          })
      }
    }
  }

  processUploadQueue(): void {
    this.isUploading = true;
    if (this.uploadQueue.length > 0) {
      this.uploadingItem = this.uploadQueue.shift();
      this.uploadingItem['percent'] = '0';

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
      } else if (this.activeFunction === 'pictures') {
        key = 'PhotoImport';
      }
      if (this.activeFunction === 'apps') {
        this.installApp(this.uploadingItem)
          .subscribe(
            (data) => {
              if(data) {
                this.messageService.info('请在手机上确认安装！');
              }
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
      } else {
        this.importSingleFile(key, this.activeAlbumId, this.uploadingItem, directory)
          .subscribe(
            (data) => {
              console.log(data);
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
                this.isUploading = false;
                this.refreshItemList();
              }
            }
          );
      }
    }
  }

  importSingleFile(key: string, AlbumID: string, file: any, Directory?: string): Observable<any> {
    const formData = new FormData();
    if (Directory) {
      formData.append('Post', JSON.stringify({
        Directory,
      }));
    } else {
      if (isDocument(file['name'])) {
        formData.append('Post', JSON.stringify({
          AlbumID: getDocTye(file['name']),
        }));
      } else {
        formData.append('Post', JSON.stringify({
          AlbumID,
        }));
      }
    }

    formData.append('File', file);

    const deviceInfo = this.browserStorageService.get('deviceInfo');

    const req = new HttpRequest('POST', `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}/?Key=${key}`, formData, {
      reportProgress: true,
    })

    return this.http.request(req).pipe(
      map(event => this.getEventMessage(event, file)),
      //tap(message => this.showProgress(message)),
      last(), // return last (completed) message to caller
      catchError(this.handleError(file))
    );
  }

  // showProgress(message): void {
  //   console.log(message);
  // }

  handleError(file): any {
    console.log(file.name);
  }

  /** Return distinct message for sent, upload progress, & response events */
  private getEventMessage(event: HttpEvent<any>, file: File) {
    switch (event.type) {
      case HttpEventType.Sent:
        return `Uploading file "${file.name}" of size ${file.size}.`;

      case HttpEventType.UploadProgress:
        // Compute and show the % done:
        const percentDone = Math.round(100 * event.loaded / event.total);
        this.uploadingItem['percent'] = percentDone + '%';
        console.log(percentDone);
        return `File "${file.name}" is ${percentDone}% uploaded.`;

      case HttpEventType.Response:
        return `File "${file.name}" was completely uploaded!`;

      default:
        return `File "${file.name}" surprising upload event: ${event.type}.`;
    }
  }

  filter(searchKey: string): void {
    if (!searchKey) {
      this.clearFilter();
      return;
    }
    if (this.activeFunction === 'contacts') {
      this.contactLetterGroupList = deepcopy(this.tempContactLetterGroupList);

      for (let i = 0, l = this.contactLetterGroupList.length; i < l; i++) {
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

  setItemList(itemList: Array<any>): void {
    this.itemList = itemList.concat();
    this.tempItemList = deepcopy(this.itemList);
  }


  getSidebarItemList(): void {
    this.resetPaging();
    this.resetSelected();
    if (this.activeFunction === 'pictures') {
      this.loading = true;
      this.getPhotoAlbumList()
        .subscribe((data) => {
          this.sidebarItemList = data;
          this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
          this.totalCount = this.sidebarItemList[0]['Count'];
          this.loading = false;
          this.getItemList(false);
        });
    } else if (this.activeFunction === 'musics') {
      this.loading = true;
      this.getMusicAlbumList()
        .subscribe((data) => {
          this.sidebarItemList = data;
          this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
          this.totalCount = this.sidebarItemList[0]['Count'];
          this.loading = false;
          this.getItemList(false);
        });
    } else if (this.activeFunction === 'videos') {
      this.loading = true;
      this.getVideoAlbumList()
        .subscribe((data) => {
          this.sidebarItemList = data;
          this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
          this.totalCount = this.sidebarItemList[0]['Count'];
          this.loading = false;
          this.getItemList(false);
        });
    } else if (this.activeFunction === 'apps') {
      this.loadingItems = true;
      this.activeAlbumId = 'apps';
      this.getAppList()
        .subscribe((data) => {
          this.itemList = data;
          this.tempItemList = deepcopy(this.itemList);
          this.loadingItems = false;
        });
    } else if (this.activeFunction === 'documents') {
      this.loading = true;
      this.getDocAlbumList()
        .subscribe((data) => {
          this.sidebarItemList = data;
          this.activeAlbumId = this.sidebarItemList[0]['AlbumID'];
          this.totalCount = this.sidebarItemList[0]['Count'];
          this.loading = false;
          this.getItemList(false);
        });
    } else if (this.activeFunction === 'clipboard') {
      this.loadingItems = true;
      this.activeAlbumId = 'clipboard';
      this.getClipboardList(this.activeAlbumId)
        .subscribe((data) => {
          this.itemList = data;
          this.tempItemList = deepcopy(this.itemList);
          this.activeItem = this.itemList.length > 0 ? this.itemList[0] : null;
          this.loadingItems = false;
        });
    } else if (this.activeFunction === 'messages') {
      this.loading = true;
      this.getAllContacts()
        .subscribe((data) => {
          this.allContacts = data;
          this.getMessageLatestList()
            .subscribe((data) => {
              this.sidebarItemList = data;
              this.tempSidebarItemList = deepcopy(this.sidebarItemList);
              if (this.sidebarItemList.length > 0) {
                this.activeAlbumId = this.sidebarItemList[0]['ID'];
                this.totalCount = this.sidebarItemList[0]['Count'];
                this.activeItem = this.sidebarItemList[0];
                this.loading = false;
                this.getItemList(false);
              } else {
                this.loading = false;
              }

            })
        })
    } else if (this.activeFunction === 'files') {
      this.loading = true;
      this.getRootFileList()
        .subscribe((data) => {
          this.root = this.transferToNodes(data).find((ele) => ele.ShowName === 'SDCard');

          if (this.root) {
            this.rootNodes = [this.root];
            this.activeNode = this.root;
            this.loading = false;
            this.getRootSubFolders();
          }
        });
    } else if (this.activeFunction === 'contacts') {
      this.loading = true;
      this.getContactGroupList()
        .subscribe((data) => {
          this.tempContactsGroupList = data;
          for (let i = 0, l = this.tempContactsGroupList.length; i < l; i++) {
            this.tempContactsGroupList[i]['key'] = this.tempContactsGroupList[i]['ID'];
            this.tempContactsGroupList[i]['label'] = this.tempContactsGroupList[i]['GroupName'];
            this.tempContactsGroupList[i]['value'] = this.tempContactsGroupList[i]['ID']
          }
          this.loading = false;
          this.getAllContacts()
            .subscribe((data) => {
              this.generateContactsData(data);
              this.generateContactGroupDetailList(data);
            });
        });
    }
  }

  getItemList(isAddTo: boolean): void {
    this.loadingItems = true;
    this.resetSelected();
    if (this.activeFunction === 'files') {
      let path;
      if (this.activeNode.origin) {
        path = this.activeNode.origin.Path;
      } else {
        path = this.activeNode.Path;
      }
      this.getDirectoryFiles(path)
        .subscribe((data) => {
          this.itemList = data;
          setTimeout(() => {
            this.loadingItems = false;
          }, 1000);
        })
    } else if (this.activeFunction === 'contacts') {
      this.getAllContacts()
        .subscribe((data) => {
          this.generateContactsData(data);
          this.generateContactGroupDetailList(data);
        });
    } else if (this.activeAlbumId) {
      if (this.activeFunction === 'pictures') {
        this.getPhotoList(this.activeAlbumId, this.Start, this.totalCount)
          .subscribe((data) => {
            this.processData(data, isAddTo);
            this.loadingItems = false;
          });
      } else if (this.activeFunction === 'musics') {
        this.getMusictList(this.activeAlbumId, this.Start, this.totalCount)
          .subscribe((data) => {
            this.processData(data, isAddTo);
            setTimeout(() => {
              this.loadingItems = false;
            }, 1000);
          });
      } else if (this.activeFunction === 'documents') {
        this.getDocList(this.activeAlbumId)
          .subscribe((data) => {
            for (let i = 0, l = data.length; i < l; i++) {
              data[i]['album'] = this.activeAlbumId;
            }
            this.itemList = data;
            this.tempItemList = deepcopy(this.itemList);
            this.loadingItems = false;
          });
      } else if (this.activeFunction === 'videos') {
        this.getVideoList(this.activeAlbumId, this.Start, this.totalCount)
          .subscribe((data) => {
            this.processData(data, isAddTo);
            this.loadingItems = false;
          });
      } else if (this.activeFunction === 'messages') {
        this.getMessageList(this.activeAlbumId, this.Start, this.totalCount)
          .subscribe((data) => {
            this.processData(data, isAddTo);
            this.loadingItems = false;
          });
      }
    }
  }

  generateContactLetterGroupList(data: Array<any>): void {
    if (!data) {
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

  generateContactGroupDetailList(data: Array<any>): void {
    this.contactGroupDetailList = [];
    for (let i = 0, l = data.length; i < l; i++) {
      if(data[i]['Groups']) {
        console.log(data[i]['Groups'])
        for (let j = 0, s = data[i]['Groups'].length; j < s; j++) {
          if (this.contactGroupDetailList.indexOf(data[i]['Groups'][j]) === -1) {
            this.contactGroupDetailList.push(data[i]['Groups'][j]);
          }
        }
      }
    }
    console.log(this.contactGroupDetailList);
  }

  isNumberInContact(): boolean {
    let flag = false;
    const contact = this.allContacts.find((ele) => {
      return ele['Phone'] && ele['Phone'][0]['Name'] === this.activeItem['Phone'];
    })
    if (contact) {
      return contact['Name']['DisplayName'] !== contact['Phone'][0]['Name'];
    }
    return flag;
  }

  generateContactsData(data): void {
    this.loadingItems = true;
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
    this.loadingItems = false;
  }

  /**
   * 设为壁纸
   * @param rotation 旋转
   */
  setAsWallpaper(rotation?: number): void {
    if (this.selectedItems[0] && this.selectedItems[0]['Path']) {
      this.setWallpaper(this.selectedItems[0]['Path'], rotation)
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
    this.getDirectoryFiles(this.root.Path)
      .subscribe((data) => {
        this.itemList = data;
        this.tempItemList = deepcopy(this.itemList);
        this.loading = false;
      });
  }

  refreshItemList(): void {
    this.resetPaging();
    // if (this.activeFunction !== 'apps' && this.activeFunction !== 'clipboard') {
    //   this.getItemList(false);
    // } else {
    //   this.getSidebarItemList();
    // }
    this.getSidebarItemList();
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
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(DynamicInputComponent)
      .create(this.injector);

    componentRef.instance.options = {
      folder: true,
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
      console.log(this.uploadQueue.length);
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

            let directory = this.activeNode && this.activeNode.Path || this.activeNode && this.activeNode.origin && this.activeNode.origin.Path ||
              this.root && this.root.Path;
            const folder = {
              Directory: directory,
              DirName: name,
            };
            this.loading = true;
            this.createDirectory([folder])
              .subscribe(
                (data) => {
                  if (data) {
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
            this.addGroup(name)
              .subscribe(
                (data: any) => {
                  if (data) {
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

      componentRef.instance.videoSrc = this.resolvePath(item.Path);
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
    this.modalService.confirm({
      amTitle: '<i>Warning</i>',
      amContent: '<b>确定要删除这些记录吗？</b>',
      amOnOk: () => {
        this.deleteDeviceItems(key, postData)
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
    this.modalService.confirm({
      amTitle: 'Warning',
      amContent: '确定要删除这条记录吗？',
      amOnOk: () => {
        this.deleteDeviceItems(key, postData)
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
    downloadLink(this.getAppLink(item));
  }

  /**
   * 下载item
   */
  download(item: any): void {
    console.log(item);
    if (item && item.Path) {
      if (item.FileType && item.FileType === 2) {
        if (this.isSupportZipDownload()) {
          this.zipFileDownload(this.activeFunction, [item.Path]);
        } else {
          this.messageService.error('不支持下载文件夹！');
        }
      } else {
        downloadLink(this.resolvePath(item.Path) + '?Export=1');
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
        this.uninstallApp(arr)
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
      this.saveToClipboard(this.clipboardValue)
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
        if (this.isSupportZipDownload()) {
          const paths = [];
          for (let i = 0, l = this.selectedItems.length; i < l; i++) {
            paths.push(this.selectedItems[i]['Path'] || this.selectedItems[i]['APPPath']);
          }
          this.zipFileDownload(this.activeFunction, paths);
        } else {
          for (let i = 0, l = this.selectedItems.length; i < l; i++) {
            this.download(this.selectedItems[i]);
          }
        }
      }
    } else if (this.activeFunction === 'contacts') {
      console.log(this.selectedItems);

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
      ele['image_thumb_url'] = this.resolveThumbPath(ele.Path, 168, 168);
      ele['image_url'] = this.resolvePath(ele.Path);
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

  setActiveViewMode(activeViewMode: 'list' | 'grid'): void {
    this.activeViewMode = activeViewMode;
  }

  setActiveItem(item: any): void {
    this.activeItem = item;
    if (this.activeFunction === 'messages') {
      this.getMessageList(item.ID, 0, item.Count)
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

  getQrCodeUrl(): Promise<any> {
    const host = hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[1];

    return new Promise((resolve) => {
      this.send({
        Key: 'WebCreateQRImage',
        Value: {
          Domain: host,
        }
      });
      this.on('ResponseWebCreateQRImage', (data) => {
        resolve(data);
        this.browserStorageService.set('hash', data.ID.substr(data.ID.lastIndexOf(':') + 1));
      });
      this.on('ResponseWebQueryOnlineDev', (data) => {
        this.clearHeartBeat();
        this.browserStorageService.set('deviceInfo', data);
        if (data.Platform === 1) {
          this.platform = 'android';
        } else if (data.Platform === 2) {
          this.platform = 'iphone';
        }
        this.send({
          Key: 'WebCloseSocket',
        });
        this.checkAuthorization();
      });
    });
  }

  checkAuthorization(): void {
    // 开始连接设备
    this.myClientService.devicePost('PhoneCheckAuthorization', {})
      .subscribe(
        (status: any) => {
          if (status === '0') {
            this.myClientService.devicePost('PhoneRequestAuthorization', {
              id: this.browserStorageService.get('hash')
            })
              .subscribe((res: any) => {
                if (res) {
                  const deviceInfo = this.browserStorageService.get('deviceInfo');
                  const host = `${deviceInfo.PrivateIP}:${deviceInfo.Port}`;
                  const protocol = 'ws:';
                  const path = '/channel.do';
                  if (this.channelClient) {
                    this.channelClient.close();
                    this.channelClient = null;
                  }
                  this.initChannel(protocol, host, path);
                  this.onChannelOpen = () => {
                    this.deviceConnected = true;
                    this.emit('DeviceConnected');
                  };
                  this.on('Disconnect', () => {
                    this.deviceConnected = false;
                    this.emit('DeviceDisconnect', {});
                  });
                  this.router.navigate(['/desktop']);
                }
              },
                (error) => {
                });
          } else if (status === '1') {
            this.messageService.error('请确保airmore应用在前台');
          } else if (status === '2') {
            this.messageService.error('移动设备已连接至其他服务, 请先断开再尝试连接.');
          } else {
            this.messageService.error('连接失败！请确保您的移动设备和电脑在同一无线网络环境内。');
          }
        },
        (error) => {
          if (error) {
          }
        }
      );
  }

  // api start
  isSupportZipDownload(): boolean {
    const deviceInfo = this.browserStorageService.get('deviceInfo');

    return (this.platform === 'android' && deviceInfo.AppVersionCode >= 5) ||
      (this.platform === 'iphone' && deviceInfo.AppVersionCode >= 8) ||
      deviceInfo.AppVersionCode >= 10;
  }

  resolvePath(path: string): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}${path}`;
  }

  resolveThumbPath(path: string, width: number, height: number): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}${path}?Shortcut=1&Width=${width}&Height=${height}`;
  }

  getDeviceInfo(): any {
    return this.browserStorageService.get('deviceInfo');
  }

  getDeviceDetails(): Observable<any> {
    return this.myClientService.devicePost('PhoneGetDeviceInfo&IsDetail=true', {})
  }


  /**
   * 获取设备屏幕截图
   */
  getScreenImage(): Observable<any> {
    return this.myClientService.devicePost('PhoneRefreshScreen', {}, { responseType: 'text' });
  }

  getPhotoAlbumList(): Observable<any> {
    return this.myClientService.devicePost('PhotoGetAlbum', {});
  }

  getPhotoList(AlbumID: string, Start: number, Limit: number): Observable<any> {
    return this.myClientService.devicePost('PhotoGetList', {
      AlbumID,
      Start,
      Limit,
    });
  }

  getMusicAlbumList(): Observable<any> {
    return this.myClientService.devicePost('MusicGetAlbum', {});
  }

  getMusictList(AlbumID: string, Start: number, Limit: number): Observable<any> {
    return this.myClientService.devicePost('MusicGetList', {
      AlbumID,
      Start,
      Limit,
    });
  }

  getVideoAlbumList(): Observable<any> {
    return this.myClientService.devicePost('VideoGetAlbum', {});
  }

  getVideoList(AlbumID: string, Start: number, Limit: number): Observable<any> {
    return this.myClientService.devicePost('VideoGetList', JSON.stringify({
      AlbumID,
      Start,
      Limit,
    }));
  }

  getAppList(): Observable<any> {
    return this.myClientService.devicePost('AppGetList&IsNeedDiskUsage=true', {
      AlbumID: 'apps',
    });
  }

  getAppLink(item: any): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}/?Key=AppBackup&Package=${item['PackageName']}`;
  }

  uninstallApp(apps: Array<any>): Observable<any> {
    return this.myClientService.devicePost('AppUninstall', JSON.stringify(apps));
  }

  installApp(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('Post', JSON.stringify({
      AlbumID: 'apps',
    }));
    formData.append('File', file);
    return this.myClientService.devicePost('AppInstall', formData);
  }

  saveToClipboard(text: string): Observable<any> {
    return this.myClientService.devicePost('ClipboardAdd', [
      {
        ID: '',
        Content: text,
        OriginName: 'web',
        Time: new Date().getTime(),
      }
    ])
  }

  saveScreenshot(): Observable<any> {
    return this.myClientService.devicePost('MirrorScreenShot&NextStep=Save', {}, { responseType: 'text' });
  }

  getDocAlbumList(): Observable<any> {
    return this.myClientService.devicePost('DocGetAlbum', {});
  }

  getDocList(AlbumID: string): Observable<any> {
    return this.myClientService.devicePost('DocGetList', {
      AlbumID,
    });
  }

  getClipboardList(AlbumID: string): Observable<any> {
    return this.myClientService.devicePost('ClipboardGetList', {
      AlbumID,
    });
  }

  deleteDeviceItems(key: string, items: Array<any>): Observable<any> {
    return this.myClientService.devicePost(key, JSON.stringify(items));
  }

  getMessageLatestList(): Observable<any> {
    return this.myClientService.devicePost('MessageGetLatest', {});
  }

  getMessageList(ID: string, Start: number, Limit: number): Observable<any> {
    return this.myClientService.devicePost('MessageGetList', {
      ID,
      Limit,
      Start,
    });
  }

  getRootFileList(): Observable<any> {
    return this.myClientService.devicePost('FileGetList&IsRecursion=false', {
      FileSystem: "FileSystem",
    });
  }

  getDirectoryFiles(Directory: string): Observable<any> {
    return this.myClientService.devicePost('FileGetList&IsRecursion=false', {
      Directory,
    });
  }

  getContactGroupList(): Observable<any> {
    return this.myClientService.devicePost('ContactGroupGetList', {});
  }

  getAllContacts(): Observable<any> {
    return this.myClientService.devicePost('ContactGetList', {
      ID: '"all_contacts"',
    })
  }

  createDirectory(folders: Array<any>): Observable<any> {
    return this.myClientService.devicePost('FileCreateDirectory', JSON.stringify(folders));
  }

  exportZip(): Observable<any> {
    return this.myClientService.devicePost('FileZipExport')
  }

  setWallpaper(path: string, rotation?: number): Observable<any> {
    return this.myClientService.devicePost('PhoneSetWallpaper', {
      Path: path,
      Rotation: rotation ? rotation : 0,
    });
  }

  call(Phone: string): Observable<any> {
    return this.myClientService.devicePost('CallMake', {
      Phone,
    })
  }

  sendMessage(Phone: string, Content: String): Observable<any> {
    return this.myClientService.devicePost('MessageSend', JSON.stringify([
      {
        ID: '',
        Content,
        Phone,
        UniqueID: generateRandomString(10),
      }
    ]))
  }

  sendMessages(messages: Array<any>): Observable<any> {
    for (let i = 0, l = messages.length; i < l; i++) {
      messages[i]['UniqueID'] = generateRandomString(10);
    }
    return this.myClientService.devicePost('MessageSend', JSON.stringify(messages));
  }

  deleteContact(AccountName: string, RawContactId: string): Observable<any> {
    return this.myClientService.devicePost('ContactDeleteMul', JSON.stringify([
      {
        AccountName,
        RawContactId,
      }
    ]))
  }

  updateContact(contacts: Array<any>): Observable<any> {
    return this.myClientService.devicePost('ContactUpdate', JSON.stringify(contacts));
  }

  addContact(contacts: Array<any>): Observable<any> {
    return this.myClientService.devicePost('ContactAdd', JSON.stringify(contacts));
  }

  addGroup(GroupName: string): Observable<any> {
    return this.myClientService.devicePost('ContactAddGroup', JSON.stringify([
      {
        GroupName,
      },
    ]));
  }

  zipFileDownload(pre: string, paths: Array<any>): void {
    const postData = {
      Paths: JSON.stringify(paths),
      Name: pre + '_airmore_' + fecha.default.format(new Date(), 'YYYYMMDD_hhmmss') + '.zip',
    }
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    const url = `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}?Key=FileZipExport`;

    console.log(postData);
    console.log(url);
    const Form = document.createElement('form');
    Form.setAttribute('target', '_blank');
    Form.setAttribute('method', 'post');
    Form.setAttribute('action', url);

    for (let name in postData) {
      const value = postData[name];
      const input = document.createElement('input');
      input.setAttribute('type', 'hidden');
      input.setAttribute('name', name);
      input.setAttribute('value', value);
      console.log(input);
      Form.append(input);
    }
    document.body.append(Form);
    console.log(Form);
    Form.submit();
    document.body.removeChild(Form);
  }

  // api end

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
