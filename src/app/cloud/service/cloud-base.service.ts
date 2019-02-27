import { Injectable, Inject } from '@angular/core';
import { CloudModule } from '../cloud.module';
import { MyClientService } from '../../shared/service/my-client.service';
import { UserInfo } from '../../shared/models/user-info.model';
import { CloudUserInfo } from '../models/cloud-user-info.model';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { Logger } from '../../shared/service/logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: CloudModule,
})
export class CloudBaseService {

  private cloudUserInfo: CloudUserInfo;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private logger: Logger,
    private myClientService: MyClientService,
    private storage: BrowserStorageService,
  ) {}

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
