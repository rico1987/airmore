import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';


@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss']
})
export class DeviceItemComponent implements OnInit {

  @Input() item: any;

  constructor(
    private browserStorageService: BrowserStorageService,
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

  checkItem(): void {

  }

  openResource(): void {

  }

  preview(): void {}

  download(): void {}

  delete(): void {
  }
  
  getAppIcon(packageName: string): string {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}?Key=AppGetIcon&Package=${packageName}`;
  }

  supportOperation(operation: 'preview' | 'download' | 'delete'): boolean {
    return true;
  }
}
