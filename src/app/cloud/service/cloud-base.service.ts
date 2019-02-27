import { Injectable } from '@angular/core';
import { CloudModule } from '../cloud.module';
import { MyClientService } from '../../shared/service/my-client.service';
import { UserInfo } from '../../shared/models/user-info.model';

@Injectable({
  providedIn: CloudModule,
})
export class CloudBaseService {

  constructor(
    private myClientService: MyClientService,
  ) { }

  getCloudToken(userInfo: UserInfo): void {
    debugger
    const data = {
      identity_token: '',
    };
    this.myClientService.post('/sessions', data);
  }

}
