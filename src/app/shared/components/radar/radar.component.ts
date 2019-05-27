import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { ConnectionService } from '../../service/connection.service';
import { DeviceService } from '../../service/device.service';
import { ModalService } from '../../service/modal';
import { Observable, Subscription } from 'rxjs';
import { getIp } from '../../../utils/tools';
import { DeviceInfo } from '../../models';
import { BrowserStorageService } from '../../service/storage.service';

@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private deviceService: DeviceService,
    private browserStorageService: BrowserStorageService,
  ) { }

  ngOnInit() {
    this.deviceService.scan();
  }

  connectTo(info: DeviceInfo): void {
    this.browserStorageService.set('deviceInfo', info);
    if (info.Platform === 1) {
      this.deviceService.platform = 'android';
    } else if (info.Platform === 2) {
      this.deviceService.platform = 'iphone';
    }
    
    this.deviceService.host = `${info.PrivateIP}:${info.Port}`;
    this.deviceService.protocol = 'ws:';
    this.deviceService.path = '/channel.do';
    this.deviceService.init();
    this.deviceService.checkAuthorization();
  }

}
