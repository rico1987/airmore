import { Injectable, Inject } from '@angular/core';
import { Observable } from 'rxjs';
const OSS = require('ali-oss');
import { MyClientService } from '../../shared/service/my-client.service';
import { CloudUserInfo } from '../models/cloud-user-info.model';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { Logger } from '../../shared/service/logger.service';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { getFileType, generateRandomString } from '../../utils/index';
import { CommonResponse, UserInfo, } from '../../shared/models';

import { UploadFile } from '../../shared/components/dynamic-input/interfaces';

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
      const appAuthStorageKey = this.appConfig.app.authStorageKey;
      const authStorageKey = this.storage.get(appAuthStorageKey)
      if (authStorageKey) {
        resolve(authStorageKey)
      } else {
        this.myClientService.get('cloud', '/upload/authentications')
          .subscribe(
            (res: CommonResponse) => {
              if (res.status === '1' && res.data) {
                resolve(res.data);
                this.storage.set(appAuthStorageKey, res.data);
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

  /**
   * 上传文件
   */
  upload(file: UploadFile, library_id: string, onProgress: Function): Promise<any> {
    return new Promise((resolve) => {
      this.getAuthentications()
        .then((token) => {
          if (token) {
            const client = new OSS({
              region: token.region_id,
							accessKeyId: token.access_id,
							accessKeySecret: token.access_secret,
							stsToken: token.security_token,
							bucket: token.bucket
            });
            
            const fileType = getFileType(file.name);
            const extension = file.name.substring(file.name.lastIndexOf('.'));
            const key = token.path[fileType] + generateRandomString(10) + extension;
            // todo
            file.key = key;
            const userargs = '&x:original_name=' + file.name + '&x:library_id=' + library_id;
            const url = token['callback']['callbackUrl'];
            const callbackBody = token['callback']['callbackBody'];
            const callback = {
              url: url,
              body: callbackBody + userargs,
            }

            return client.multipartUpload(key, file, {
              cancelFlag: true,
              callback: callback,
              progress: onProgress,
              partSize: 500 * 1024,
              headers: {
                'Content-Disposition': encodeURI(file.name),
              },
            })
          }
        });
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

  getCloudSpaceInfo(): Observable<any> {
    return this.myClientService.get('cloud', '/my/info')
  }

}
