import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { MyClientService } from './my-client.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends WebsocketService {



  constructor(
    private browserStorageService: BrowserStorageService,
    private myClientService: MyClientService,
    private router: Router,
    protected logger: Logger,
  ) {
    super(logger);
  }

  init() {
    super.init();
    this.checkAuthorization();
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

  /**
   * 获取设备屏幕截图
   */
  getScreenImage(): Observable<any> {
    return this.myClientService.devicePost('PhoneRefreshScreen', {});
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

  createDirectory(folders: Array<any>): Observable<any> {
    return this.myClientService.devicePost('FileCreateDirectory', JSON.stringify(folders));
  }
}
