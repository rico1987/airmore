import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';
import { DeviceService } from '../../../shared/service/device.service';


@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss']
})
export class DeviceItemComponent implements OnInit {

  @Input()
  get item(): any { return this._item; }
  set item(item: any) { this._item = item; }
  private _item: any;

  constructor(
    private browserStorageService: BrowserStorageService,
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  checkItem(): void {
    if (this.isSelected) {
      this.deviceStateService.removeItems([this.item]);
    } else {
      this.deviceStateService.addItems([this.item]);
    }
  }

  openResource(): void {

  }

  playVideo(event: Event): void {
    this.deviceStateService.playVideo(this.item);
    event.stopPropagation();
  }

  download(event: Event): void {
    this.deviceStateService.download(this.item);
    event.stopPropagation();
  }

  delete(event: Event): void {
    if (this.deviceStateService.activeFunction === 'apps') {
      this.deviceStateService.uninstall(this.item);
    } else {
      this.deviceStateService.deleteItem(this.item);
    }
    event.stopPropagation();
  }

  backup(event: Event): void {
    this.deviceStateService.backupSingleApp(this.item);
    event.stopPropagation();
  }

  getAppIcon(packageName: string): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}?Key=AppGetIcon&Package=${packageName}`;
  }

  resolveVideoCoverPath(path: string): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}${path}?Shortcut=1&Width=168&Height=168`;
  }

  supportOperation(operation: 'preview' | 'download' | 'delete'): boolean {
    return true;
  }

  get isSelected(): boolean {
    return this.deviceStateService.hasItem(this.item);
  }
}
