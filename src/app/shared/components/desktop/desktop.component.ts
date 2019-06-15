import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppService } from '../../service/app.service';
import { DeviceService, UserService } from '../../service';
import { ModalService } from '../../service/modal';
import { ToolModalComponent } from '../tool-modal/tool-modal.component';
import { ReflectorModalComponent } from '../reflector-modal/reflector-modal.component';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  functions: Array<string>;

  constructor(
    private router: Router,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private appService: AppService,
    private deviceService: DeviceService,
    private modalService: ModalService,
    private userService: UserService,
  ) {
    if (this.deviceService.platform === 'iphone') {
      this.functions = this.appConfig.app.iosDesktopFunctions;
    } else {
      this.functions = this.appConfig.app.androidDesktopFunctions;
    }
  }

  ngOnInit() {
  }

  setActiveFunction(fun): void {
    if (fun !== 'cloud') {
      if (fun === 'reflector') {
        const reflectorModal = this.modalService.create({
          amTitle: 'Reflector',
          amContent: ReflectorModalComponent,
          amWidth: 360,
          amFooter: null,
          amMaskClosable: false,
          amClosable: true,
          amOnOk: () => {
    
          }
        });
      } else if (fun === 'tool') {
        const toolModal = this.modalService.create({
          amTitle: 'Tools',
          amContent: ToolModalComponent,
          amWidth: '80%',
          amFooter: [
            {
              label: 'OK',
              onClick: componentInstance => {
                toolModal.close();
              }
            }
          ],
          amMaskClosable: false,
          amClosable: true,
          amOnOk: () => {
            
          }
        });
      } else {
        this.appService.setCurrentModule('device');
        this.deviceService.setDeviceActiveFunction(fun);
        this.router.navigate(
          ['device']
        );
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

}
