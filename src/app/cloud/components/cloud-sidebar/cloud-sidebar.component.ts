import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { CloudStateService } from '../../service/cloud-state.service';
import { CloudBaseService } from '../../service/cloud-base.service';
import { CommonResponse } from '../../../shared/models/common-response.model';

import { MessageService } from '../../../shared/service/message.service';

@Component({
  selector: 'app-cloud-sidebar',
  templateUrl: './cloud-sidebar.component.html',
  styleUrls: ['./cloud-sidebar.component.scss']
})
export class CloudSidebarComponent implements OnInit {

  usedSpace: string;

  totalSpace: string;

  functions: Array<string>;

  functionNameMap = {
    'clouds': 'Cloud Files',
    'pictures': 'Pictures',
    'musics': 'Music',
    'videos': 'Videos',
    'documents': 'Documents',
    'others': 'Others',
  };

  activeFunction: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';


  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudStateService: CloudStateService,
    private cloudBaseService: CloudBaseService,
    private messageService: MessageService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }

  ngOnInit() {
    this.getSpaceInfo();
  }

  getSpaceInfo(): void {
    this.cloudBaseService.getCloudSpaceInfo()
      .subscribe(
        (data: CommonResponse) => {
          this.usedSpace = (data.data.used_space / 1024 / 1024 / 1024).toFixed(2);
          this.totalSpace = (data.data.total_space / 1024 / 1024 / 1024).toFixed(2);
        },
        (error) => {
          if (error) {
            this.messageService.error('获取空间信息失败');
          }
        },
        () => {
        }
      );
  }

  setCloudActiveFunction(fun: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others'): void {
    this.activeFunction = fun;
    this.cloudStateService.setCloudActiveFunction(fun);
  }
}
