import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceService } from '../../../shared/service/device.service';
import { ProductsInfoService } from '../../../shared/service/products-info.service';

@Component({
  selector: 'app-device-info',
  templateUrl: './device-info.component.html',
  styleUrls: ['./device-info.component.scss']
})
export class DeviceInfoComponent implements OnInit {

  screenshot: string;

  loading: boolean = false;

  deviceInfo: any;

  platform: 'android' | 'iphone';

  iphoneUsedStorageWidth: string = '0';

  photoUsedStorageWidth: string = '0';

  musicUsedStorageWidth: string = '0';

  videoUsedStorageWidth: string = '0';

  appsUsedStorageWidth: string = '0';

  othersUsedStorageWidth: string = '0';

  showAdd: boolean = true;


  constructor(
    private appStateService: AppStateService,
    private deviceService: DeviceService,
    private productsInfoService: ProductsInfoService,
  ) {
    this.platform = this.deviceService.platform;
    this.refreshScreenshot();
    this.getDeviceDetails();
  }

  ngOnInit() {
  }

  refreshScreenshot(): void {
    this.loading = true;
    this.deviceService.getScreenImage()
      .subscribe(
        (data) => {
          this.screenshot = data;
          this.loading = false;
        }
      );
  }

  getDeviceDetails(): void {
    this.deviceService.getDeviceDetails()
      .subscribe(
        (data) => {
          this.deviceInfo = data;
          setTimeout(() => {
            this.deviceInfo['OtherSize'] = this.deviceInfo['MemorySize'] 
                                          - this.deviceInfo['PicSize']
                                          - this.deviceInfo['MusicSize']
                                          - this.deviceInfo['VideoSize']
                                          - this.deviceInfo['APKSize'];
            this.iphoneUsedStorageWidth = `${100 * (1 - (this.deviceInfo['MemoryAvaSize'] / this.deviceInfo['MemorySize']))}%`;
            this.photoUsedStorageWidth = `${100 * (this.deviceInfo['PicSize'] / this.deviceInfo['MemorySize']) || 0}%`;
            this.musicUsedStorageWidth = `${100 * (this.deviceInfo['MusicSize'] / this.deviceInfo['MemorySize']) || 0}%`;
            this.videoUsedStorageWidth = `${100 * (this.deviceInfo['VideoSize'] / this.deviceInfo['MemorySize']) || 0}%`;
            this.appsUsedStorageWidth = `${100 * (this.deviceInfo['APKSize'] / this.deviceInfo['MemorySize']) || 0}%`;
            this.othersUsedStorageWidth = `${100 * (this.deviceInfo['OtherSize'] / this.deviceInfo['MemorySize']) || 0}%`;
          }, 1000);
        }
      );
  }

  closeAdd(event: Event): void {
    this.showAdd = false;
    event.stopPropagation();
  }

  get softwareDownloadLink(): string {
    return this.productsInfoService.getProductURL('phone-manager');
  }
}
