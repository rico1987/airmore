import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../service/app-state.service';
import { DeviceStateService } from '../../service';
import { DeviceService } from '../../service/device.service';
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
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
    private modalService: ModalService,
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
          amFooter: null,
          amMaskClosable: false,
          amClosable: true,
          amOnOk: () => {
            
          }
        });
      } else {
        this.appStateService.setCurrentModule('device');
        this.deviceStateService.setDeviceActiveFunction(fun);
        this.router.navigate(
          ['device']
        );
      }
    } else {
      this.appStateService.setCurrentModule('cloud');
      this.router.navigate(
        ['cloud']
      );
    }
  }

}
