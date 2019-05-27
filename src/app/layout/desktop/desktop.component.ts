import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/service/modal';
import { Router } from '@angular/router';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { ConnectionService } from '../../shared/service/connection.service';
import { AppStateService } from '../../shared/service/app-state.service';
import { DeviceService } from '../../shared/service/device.service';
import { AboutModalComponent } from '../../shared/components/about-modal/about-modal.component';
import { HelpModalComponent } from '../../shared/components/help-modal/help-modal.component';

@Component({
  selector: 'app-layout-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class LayoutDesktopComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private browserStorageService: BrowserStorageService,
    private appStateService: AppStateService,
    private connectionService: ConnectionService,
    private router: Router,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  logout(): void {
    this.modalService.confirm({
      amTitle: '<i>Warning</i>',
      amContent: '<b>确定要断开连接吗？</b>',
      amOnOk: () => {
        this.deviceService.deviceConnected = false;
        this.browserStorageService.clear();
        this.router.navigate(['/connect']);
      }
    });
  }

  gotoAccount(): void {
    // todo
    if (this.appStateService.isAccountLogined) {

    } else {
      this.connectionService.activeConnectionType = 'account';
    }
  }

  showAboutModal(): void {
    const abountModal = this.modalService.create({
      amTitle: '关于',
      amContent: AboutModalComponent,
      amWidth: 389,
      amFooter: [
        {
          label: 'OK',
          onClick: componentInstance => {
            abountModal.close();
          }
        }
      ],
      amMaskClosable: false,
      amClosable: true,
      amMask: true,
      amOnOk: () => {

      }
    });
  }

  showHelp(): void {
    const helpModal = this.modalService.create({
      amTitle: '帮助',
      amContent: HelpModalComponent,
      amWidth: 680,
      amFooter: [
        {
          label: 'OK',
          onClick: componentInstance => {
            helpModal.close();
          }
        }
      ],
      amMaskClosable: false,
      amClosable: true,
      amMask: true,
      amOnOk: () => {

      }
    });
  }
}
