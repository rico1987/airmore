import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppService } from '../../../shared/service/app.service';
import { DeviceService, MessageService, UserService, ModalService} from '../../service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  functions: [string];

  constructor(
    private appService: AppService,
    private deviceService: DeviceService,
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
    this.appService.searchKey = null;
    if (fun !== 'cloud') {
      if (this.deviceService.deviceConnected) {
        this.appService.setCurrentModule('device');
        this.router.navigate(
          ['device']
        );
        this.deviceService.setDeviceActiveFunction(fun);
      } else {
        this.deviceService.activeConnectionType = 'qrcode';
        this.appService.showConnection('qrcode');
        this.modalService.error({
          amTitle: null,
          amContent: '需要连接手机后才可以查看到手机中的文件哦'
        })
      }
    } else {
      if (this.userService.isAccountLogined) {
        this.appService.setCurrentModule('cloud');
        this.router.navigate(
          ['cloud']
        );
      } else {
        this.appService.showConnection('account');
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
      this.deviceService.activeConnectionType = 'qrcode';
      this.appService.showConnection('qrcode');
    }
  }

}
