import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService, DeviceService, ConnectionService, MessageService } from '../../service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  functions: [string];

  constructor(
    private deviceStateService: DeviceStateService,
    private appStateService: AppStateService,
    private deviceService: DeviceService,
    private connectionService: ConnectionService,
    private messageService: MessageService,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private router: Router,
  ) {
    // android and ios have different functions
    if (this.deviceService.platform === 'iphone') {
      this.functions = appConfig.app.iosSidebarFunctions;
    } else if (this.deviceService.platform === 'android') {
      this.functions = appConfig.app.androidSidebarFunctions;
    }
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard' | 'cloud'): void {
    if (fun !== 'cloud') {
      if (this.deviceService.deviceConnected) {
        this.appStateService.setCurrentModule('device');
        this.router.navigate(
          ['device']
        );
        this.deviceStateService.setDeviceActiveFunction(fun);
      } else {
        this.messageService.error('需要连接手机后才可以查看手机中的文件哦');
        this.connectionService.activeConnectionType = 'qrcode';
        this.appStateService.showConnection('qrcode');
      }
    } else {
      
      this.appStateService.setCurrentModule('cloud');
      this.router.navigate(
        ['cloud']
      );
    }
  }

  gotoDesktop(): void {
    if (this.deviceService.deviceConnected) {
      this.router.navigate(
        ['desktop']
      );
    } else {
      this.messageService.error('需要连接手机后才可以查看手机中的文件哦');
      this.connectionService.activeConnectionType = 'qrcode';
      this.appStateService.showConnection('qrcode');
    }
  }

}
