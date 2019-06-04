import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/service/modal';
import { Router } from '@angular/router';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { AppService } from '../../shared/service/app.service';
import { DeviceService } from '../../shared/service/device.service';
import { AboutModalComponent } from '../../shared/components/about-modal/about-modal.component';
import { HelpModalComponent } from '../../shared/components/help-modal/help-modal.component';
import { UserService } from '../../shared/service/user.service';

@Component({
  selector: 'app-layout-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class LayoutDesktopComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private browserStorageService: BrowserStorageService,
    private appService: AppService,
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
    this.appService.showConnection('account');
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
