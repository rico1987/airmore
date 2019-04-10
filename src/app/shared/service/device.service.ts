import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { AppStateService } from './app-state.service';
import { MyClientService } from './my-client.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends WebsocketService{

  constructor(
    private browserStorageService: BrowserStorageService,
    private appStateService: AppStateService,
    private myClientService: MyClientService,
    private router: Router,
    protected logger: Logger,
  ) {
    super(logger);
  }

  init() {
    super.init();
    // 开始连接设备
    this.appStateService.setConnectionStatus('connecting');
    this.myClientService.devicePost('PhoneCheckAuthorization', {})
      .subscribe(
        (status: any) => {
          if (status === '0') {
            this.myClientService.devicePost('PhoneRequestAuthorization', {
              id: this.browserStorageService.get('hash')
            })
              .subscribe((res: any) => {
                if (res) {
                  this.appStateService.setConnectionStatus('connected');
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
            debugger
          }
        }
      );
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
  
  getPhotoList(): Observable<any> {
    return this.myClientService.devicePost('PhotoGetList', {});
  }
}
