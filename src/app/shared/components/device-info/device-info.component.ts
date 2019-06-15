import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../shared/service/app.service';
import { DeviceService } from '../../../shared/service/device.service';
import { ProductsInfoService } from '../../../shared/service/products-info.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';

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
    private browserStorageService: BrowserStorageService,
    private deviceService: DeviceService,
    private productsInfoService: ProductsInfoService,
    private appService: AppService,
  ) {
    this.platform = this.deviceService.platform;
    this.refreshScreenshot();
    this.getDeviceDetails();
  }

  ngOnInit() {
  }

  openScr(): void {
    this.appService.openReflector();
  }

  openRef(): void {
    this.appService.openReflector();
  }

  refreshScreenshot(): void {
    this.loading = true;
    this.deviceService.getScreenImage()
      .subscribe(
        (data) => {
          this.browserStorageService.set('screenshot', data);
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
          if (this.deviceInfo.AccountInfo) {
            try {
              const accountInfo = JSON.parse(this.deviceInfo.AccountInfo);
              console.log(accountInfo);
            } catch (e) {
              console.log(e);
            }
          }
          setTimeout(() => {
            this.deviceInfo['OtherSize'] = this.deviceInfo['MemorySize'] 
                                          - this.deviceInfo['PicSize']
                                          - this.deviceInfo['MusicSize']
                                          - this.deviceInfo['VideoSize']
                                          - this.deviceInfo['APKSize']
                                          - this.deviceInfo['MemoryAvaSize'];
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

  closeAdd(event: Event): boolean {
    this.showAdd = false;
    event.stopPropagation();
    return false;
  }

  get softwareDownloadLink(): string {
    return this.productsInfoService.getProductURL('phone-manager');
  }
}
