import { Component, OnInit } from '@angular/core';
import { ModalService } from '../../shared/service/modal';
import { Router } from '@angular/router';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { AppStateService } from '../../shared/service/app-state.service';
import { DeviceService } from '../../shared/service/device.service';

@Component({
  selector: 'app-layout-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class LayoutDesktopComponent implements OnInit {

  constructor(
    private modalService: ModalService,
    private browserStorageService: BrowserStorageService,
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
}
