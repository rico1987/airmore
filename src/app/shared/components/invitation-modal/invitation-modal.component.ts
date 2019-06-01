import { Component, OnInit } from '@angular/core';
import { CloudBaseService } from '../../../shared/service/cloud-base.service';
import { MessageService  } from '../../../shared/service/message.service';

@Component({
  selector: 'app-invitation-modal',
  templateUrl: './invitation-modal.component.html',
  styleUrls: ['./invitation-modal.component.scss']
})
export class InvitationModalComponent implements OnInit {

  private route: 'getSpace' | 'getSpaceSuccess' | 'shareWithApp' | 'useInvitationCode' | 'invited' = 'getSpace';

  private invitationCode: string;

  private obtainedSpace: number = 0;

  private inviteCodeInfo: any;

  private available_space = 0;

  private hasBeenInvited = false;

  constructor(
    private cloudBaseService: CloudBaseService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.getCloudInvitationInfo();
  }

  getCloudInvitationInfo(): void {
    this.inviteCodeInfo = null;
    this.cloudBaseService.getCloudInvitationInfo()
      .subscribe((data) => {
        if (data && data.data) {
          this.inviteCodeInfo = data.data;
          this.available_space = Math.floor(this.inviteCodeInfo.available_space/1024/1024/1024);
          this.cloudBaseService.getCloudInvitationCodeInfo()
            .subscribe((res) => {
              if (res && res.data && res.data.has_guider === 1) {
                this.hasBeenInvited = true;
              }
            });
        }
      });
  }

  changeRoute(route: 'getSpace' | 'getSpaceSuccess' | 'shareWithApp' | 'useInvitationCode' | 'invited'): void {
    if (route === 'useInvitationCode' && this.hasBeenInvited) {
      this.route = 'invited';
    } else {
      this.route = route;
    }
  }

  getSpace(): void {
    if (this.available_space > 0) {
      
    } else {
      this.messageService.error('暂时没有空间可以领取');
    }
  }

  submitInvitationCode(): void {
    if (this.invitationCode) {
      this.cloudBaseService.getSpace(this.invitationCode)
        .subscribe((data) => {
          if (data.error) {
            switch (data.statss) {
              case -214:
                this.messageService.error('Invalid invitation code')
                break;
              case -215:
                this.messageService.error('The invitation code has been used')
                break;
              case -216:
                this.messageService.error('The invitation code has been used up to the maximum number of times')
                break;
              default:
                this.messageService.error('The invitation code failed')
            }
          } else {
            this.obtainedSpace = 1;
            this.route = 'getSpaceSuccess';
          }
        }, (error) => {

        }, () => {
          // todo
        });
    }
  }

  get shareURL(): string {
    let url: string;
    if (location.hostname.indexOf('airmore.cn') > -1) {
      url = 'https://airmore.cn';
    } else {
      url = 'https://airmore.com';
    }
    return url
  }

  get shareTitle(): string {
    let title;
    if (location.hostname.indexOf('airmore.cn') > -1) {
      title = 'Airmore';
    } else {
      title = '爱莫助手-无线数据互传';
    }
    return title;
  }

  get shareText(): string {
    let text;
    if (location.hostname.indexOf('airmore.cn') > -1) {
      text = `我的爱莫云盘存储空间不足，快来帮我抢更多云空间吧！注册后输入我的邀请码： ${this.inviteCodeInfo.code}， 我就能获得免费存储空间啦！同样有惊喜等着你哦`;
    } else {
      text = `I\'m in need of more cloud storage space! Help me get more on ApowerCloud! After registration, enter my invite code: ${this.inviteCodeInfo.code}, then I\'ll get more space! There is also a surprise for you!`;
    }
    return text;
  }
}
