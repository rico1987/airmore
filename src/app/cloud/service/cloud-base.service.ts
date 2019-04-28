import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
import { MyClientService } from '../../shared/service/my-client.service';
import { CommonResponse } from '../../shared/models/common-response.model';
import { UserInfo } from '../../shared/models/user-info.model';
import { CloudUserInfo } from '../models/cloud-user-info.model';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { Logger } from '../../shared/service/logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class CloudBaseService {

  private cloudUserInfo: CloudUserInfo;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private logger: Logger,
    private myClientService: MyClientService,
    private storage: BrowserStorageService,
  ) {}


  /**
   * 获取上传auth
   */
  getAuthentications(): Promise<any> {
    return new Promise((resolve) => {
      const authStorageKey = this.storage.get(this.appConfig.app.authStorageKey)
      if (authStorageKey) {
        resolve(authStorageKey)
      } else {
        this.myClientService.get('cloud', '/upload/authentications')
          .subscribe(
            (res: CommonResponse) => {
              if (res.data && res.data.status === '1') {
                resolve(res.data.data);
                this.storage.set(this.appConfig.app.authStorageKey, res.data.data);
              }
            },
            (error) => {
              if (error) {
                resolve();
              }
            },
            () => {
            }
          )
      }
    });
  }

  setCloudUserInfo(v: CloudUserInfo): void {
    this.storage.set(this.appConfig.app.cloudStorageKey, v);
    this.cloudUserInfo = v;
  }

  getCloudUserInfo(): CloudUserInfo | any {
    return this.storage.get(this.appConfig.app.cloudStorageKey);
  }

  getCloudToken(userInfo: UserInfo): void {
    this.myClientService.post('cloud', '/sessions', { identity_token: userInfo.identity_token })
      .subscribe((data) => {
        if (data.data && data.data.user) {
          this.setCloudUserInfo(data.data.user);
        }
      },
      (error) => {
        if (error) {
          this.logger.error(error);
        }
      });
  }

}
