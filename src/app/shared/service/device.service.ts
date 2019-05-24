import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { MyClientService } from './my-client.service';
import { DeviceInfo } from '../models/device-info.model';
import { getIp } from '../../utils/tools';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends WebsocketService {

  // 雷达连接相关 start

  private availableConnections: Array<DeviceInfo> = [];

  private detectReqs: Array<Subscription> = [];

  private failedHosts: Array<any> = [];

  private intervalId: any = null;

  scan(): void {
    getIp()
      .subscribe((ip) => {
        this.detectClosedIp(ip);
      }, (err) => {
        console.log(err);
      })
  }
  
  reScan(): void {
    this.intervalId = window.setInterval(() => {
      this.detectReqs = [];

      for (let i = 0, l = this.failedHosts.length; i < l; i++) {
        const host = this.failedHosts[i];
        const req = this.queryOnlineDevice(host)
          .subscribe(
            (info: DeviceInfo) => {
              this.onOnlineDevice(host, info);
            },
            (error) => {
              console.log(error);
            },
            () => {
              if (!this.availableConnections.some((ele) => `http://${ele.PrivateIP}:${ele.Port}` === host)) {
                this.failedHosts.push(host);
              }
            }
          )
        this.detectReqs.push(req);
      }
      this.failedHosts = [];
    }, 5000);
  }

  stopScan(): void {
    window.clearInterval(this.intervalId);
    this.intervalId = null;

    for(let i = 0, l = this.detectReqs.length; i < l; i++) {
      this.detectReqs[i].unsubscribe();
    }
    this.failedHosts = [];
    this.detectReqs = [];
  }
  
  detectClosedIp(ip: string): void {
    if (!ip) {
      return
    }

    this.availableConnections = []
    this.detectReqs = []

    const ipLastNum = Number(ip.substr(ip.lastIndexOf('.') + 1));
    let start = Math.max(1, ipLastNum - 50);
    const end   = Math.min(254, ipLastNum + 50);

    if (ipLastNum >= 100) {
      start = 100
    }

    for (let i = start; i <= end; i++) {
      if (i === ipLastNum) {
        continue
      }

      const newIp = ip.replace(/\d+$/, i.toString())
      let host = 'http://' + newIp + ':2333'
      const req = this.queryOnlineDevice(host)
        .subscribe(
          (info: DeviceInfo) => {
            this.onOnlineDevice(host, info);
          },
          (error) => {
            console.log(error);
          },
          () => {
            if (!this.availableConnections.some((ele) => `http://${ele.PrivateIP}:${ele.Port}` === host)) {
              console.log(host);
              this.failedHosts.push(host);
            }
          }
        )
      this.detectReqs.push(req);
    }
    this.reScan()
  }

  onOnlineDevice(host: string, info: DeviceInfo): void {
    if (info && info.DeviceName && info.Model) {
      this.availableConnections.push(info);
    }
  }

  // 雷达连接相关 end

  constructor(
    private http: HttpClient,
    private browserStorageService: BrowserStorageService,
    private myClientService: MyClientService,
    private router: Router,
    private log: Logger
  ) {
    super(log);
  }

  init() {
    super.init();
    this.checkAuthorization();
  }

  queryOnlineDevice(host: string): Observable<any> {
    return this.http.post(`${host}/?Key=WebQueryOnlineDevice`, {}, {});
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
                  this.router.navigate(['/desktop']);
                }
              },
              (error) => {
              });
          } else if (status === '1') {

          } else if (status === '2') {

          } else {

          }
        },
        (error) => {
          if (error) {
          }
        }
      );
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
    return this.myClientService.devicePost('PhoneRefreshScreen', {}, {
      responseType: 'text/plain',
    });
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

  uninstall(apps: Array<any>): Observable<any> {
    return this.myClientService.devicePost('AppUninstall', JSON.stringify(apps));
  }

  install(file: any): Observable<any> {
    const formData = new FormData();
    formData.append('Post', JSON.stringify({
      AlbumID: 'apps',
    }));
    formData.append('File', file);
    return this.myClientService.devicePost('AppInstall', formData);
  }

  importFile(key: string, AlbumID: string, file: any): Observable<any> {
    const formData = new FormData();
    formData.append('Post', JSON.stringify({
      AlbumID,
    }));
    formData.append('File', file);
    return this.myClientService.devicePost(key, formData);
  }

  saveClipboard(text: string): Observable<any> {
    return this.myClientService.devicePost('ClipboardAdd', [
      {
        ID: '',
        Content: text,
        OriginName: 'web',
        Time: new Date().getTime(),
      }
    ])
  }

  getDocAlbumList(): Observable<any> {
    return this.myClientService.devicePost('DocGetAlbum', {});
  }

  getDocList(AlbumID: string): Observable<any> {
    return this.myClientService.devicePost('DocGetList', {
      AlbumID,
    });
  }

  getClipboardList(AlbumID: string):  Observable<any> {
    return this.myClientService.devicePost('ClipboardGetList', {
      AlbumID,
    });
  }

  deleteItems(key: string, items: Array<any>): Observable<any> {
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
    return this.myClientService.devicePost('FileZipExport', )
  }

  /**
   * 设为壁纸
   * @param path 路径
   * @param rotation 旋转
   */
  setAsWallpaper(path: string, rotation?: number): Observable<any> {
    return this.myClientService.devicePost('PhoneSetWallpaper', {
      Path: path,
      Rotation: rotation ? rotation : 0,
    });
  }
}
