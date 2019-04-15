import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service/device-state.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';

@Component({
  selector: 'app-device-sidebar',
  templateUrl: './device-sidebar.component.html',
  styleUrls: ['./device-sidebar.component.scss']
})
export class DeviceSidebarComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
    private browserStorageService: BrowserStorageService,
  ) { }

  ngOnInit() {
    this.deviceStateService.getSidebarItemList();
  }

  getAddress(path: string): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}${path}`;
  }

  selectAlbum(item): void {
    this.deviceStateService.selectAlbum(item.AlbumID);
  }
}
