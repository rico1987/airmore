import { Component, OnInit, Input } from '@angular/core';
import { BrowserStorageService, DeviceService } from '../../../shared/service';


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
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  checkItem(): void {
    if (this.isSelected) {
      this.deviceService.removeItems([this.item]);
    } else {
      this.deviceService.addItems([this.item]);
    }
  }

  playImage(event): void {
    this.deviceService.preview(this.item);
    event.stopPropagation();
  }

  openResource(): void {

  }

  playVideo(event: Event): void {
    this.deviceService.playVideo(this.item);
    event.stopPropagation();
  }

  download(event: Event): void {
    this.deviceService.download(this.item);
    event.stopPropagation();
  }

  delete(event: Event): void {
    if (this.deviceService.activeFunction === 'apps') {
      this.deviceService.uninstall(this.item);
    } else {
      this.deviceService.deleteItem(this.item);
    }
    event.stopPropagation();
  }

  backup(event: Event): void {
    this.deviceService.backupSingleApp(this.item);
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
    return this.deviceService.hasItem(this.item);
  }
}
