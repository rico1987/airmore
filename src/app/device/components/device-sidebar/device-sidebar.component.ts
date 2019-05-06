import { Component, OnInit } from '@angular/core';
const copy = require('clipboard-copy')
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service/device-state.service';
import { DeviceService } from '../../../shared/service/device.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';
import { MessageService } from '../../../shared/service/message.service';

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
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.deviceStateService.getSidebarItemList();
  }

  getThumbPath(path: string, size: number): string {
    const thumbSize = size || 168;
    return `${this.deviceService.resolvePath(path)}?Shortcut=1&Width=${thumbSize}&Height=${thumbSize}`;
  }

  selectAlbum(item): void {
    this.deviceStateService.selectAlbum(item);
  }

  checkItem(item): void {
    if (this.deviceStateService.hasItem(item)) {
      this.deviceStateService.removeItems([item]);
    } else {
      this.deviceStateService.addItems([item]);
    }
  }

  isSelected(item): boolean {
    return this.deviceStateService.hasItem(item);
  }

  copyToClipboard(item, event: Event): void {
    event.stopPropagation();
    copy(item.Content);
    this.messageService.success('Copied to clipboard!');
  }
}
