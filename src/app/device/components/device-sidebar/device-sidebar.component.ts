import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service/device-state.service';
import { DeviceService } from '../../../shared/service/device.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';

@Component({
  selector: 'app-device-sidebar',
  templateUrl: './device-sidebar.component.html',
  styleUrls: ['./device-sidebar.component.scss']
})
export class DeviceSidebarComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private browserStorageService: BrowserStorageService,
  ) { }

  ngOnInit() {
    this.deviceStateService.getSidebarItemList();
  }

  getThumbPath(path: string, size: number): string {
    const thumbSize = size || 168;
    return `${this.deviceService.resolvePath(path)}?Shortcut=1&Width=${thumbSize}&Height=${thumbSize}`;
  }

  selectAlbum(item): void {
    this.deviceStateService.selectAlbum(item.AlbumID);
  }
}
