import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService, DeviceService, ConnectionService, MessageService, UserService, ModalService} from '../../service';
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
    private userService: UserService,
    private modalService: ModalService,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private router: Router,
  ) {
    // android and ios have different functions
    if (this.deviceService.platform === 'iphone') {
      this.functions = appConfig.app.iosSidebarFunctions;
    } else {
      this.functions = appConfig.app.androidSidebarFunctions;
    } 
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard' | 'cloud'): void {
    this.appStateService.searchKey = null;
    if (fun !== 'cloud') {
      if (this.deviceService.deviceConnected) {
        this.appStateService.setCurrentModule('device');
        this.router.navigate(
          ['device']
        );
        this.deviceStateService.setDeviceActiveFunction(fun);
      } else {
        this.connectionService.activeConnectionType = 'qrcode';
        this.appStateService.showConnection('qrcode');
        this.modalService.error({
          amTitle: null,
          amContent: '需要连接手机后才可以查看到手机中的文件哦'
        })
      }
    } else {
      if (this.userService.isAccountLogined) {
        this.appStateService.setCurrentModule('cloud');
        this.router.navigate(
          ['cloud']
        );
      } else {
        this.appStateService.showConnection('account');
      }
      
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
