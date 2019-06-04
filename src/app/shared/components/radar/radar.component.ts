import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
import { Observable, Subscription } from 'rxjs';
import { getIp } from '../../../utils/tools';
import { DeviceInfo } from '../../models';
import { BrowserStorageService } from '../../service/storage.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Component({
  selector: 'app-radar',
  templateUrl: './radar.component.html',
  styleUrls: ['./radar.component.scss']
})
export class RadarComponent implements OnInit {

  private availableConnections: Array<DeviceInfo> = [];

  private detectReqs: Array<Subscription> = [];

  private failedHosts: Array<any> = [];

  private intervalId: any = null;

  constructor(
    private http: HttpClient,
    private deviceService: DeviceService,
    private browserStorageService: BrowserStorageService,
  ) { }

  ngOnInit() {
    this.scan();
  }

  scan(): void {
    getIp()
      .subscribe((ip) => {
        this.detectClosedIp(ip);
      }, (err) => {
      })
  }
  
  reScan(): void {
    this.intervalId = window.setInterval(() => {
      this.detectReqs = [];

      for (let i = 0, l = this.failedHosts.length; i < l; i++) {
        const host = this.failedHosts[i];
        const req = this.queryOnlineDevice(host)
          .subscribe(
            (info: DeviceInfo) => {
              this.onOnlineDevice(host, info);
            },
            (error) => {
              console.log(error);
            },
            () => {
              if (!this.availableConnections.some((ele) => `http://${ele.PrivateIP}:${ele.Port}` === host)) {
                this.failedHosts.push(host);
              }
            }
          )
        this.detectReqs.push(req);
      }
      this.failedHosts = [];
    }, 5000);
  }

  stopScan(): void {
    window.clearInterval(this.intervalId);
    this.intervalId = null;

    for(let i = 0, l = this.detectReqs.length; i < l; i++) {
      this.detectReqs[i].unsubscribe();
    }
    this.failedHosts = [];
    this.detectReqs = [];
  }

  detectClosedIp(ip: string): void {
    if (!ip) {
      return
    }

    this.availableConnections = []
    this.detectReqs = []

    const ipLastNum = Number(ip.substr(ip.lastIndexOf('.') + 1));
    let start = Math.max(1, ipLastNum - 50);
    const end   = Math.min(254, ipLastNum + 50);

    if (ipLastNum >= 100) {
      start = 100
    }

    for (let i = start; i <= end; i++) {
      if (i === ipLastNum) {
        continue
      }

      const newIp = ip.replace(/\d+$/, i.toString())
      let host = 'http://' + newIp + ':2333'
      const req = this.queryOnlineDevice(host)
        .subscribe(
          (info: DeviceInfo) => {
            this.onOnlineDevice(host, info);
          },
          (error) => {
          },
          () => {
            if (!this.availableConnections.some((ele) => `http://${ele.PrivateIP}:${ele.Port}` === host)) {
              this.failedHosts.push(host);
            }
          }
        )
      this.detectReqs.push(req);
    }
    this.reScan()
  }

  onOnlineDevice(host: string, info: DeviceInfo): void {
    if (info && info.DeviceName && info.Model) {
      if (!this.availableConnections.some((ele) => ele['PrivateIP'] === info['PrivateIP']) && this.availableConnections.length < 4) {
        this.availableConnections.push(info);
      }
    }
  }

  queryOnlineDevice(host: string): Observable<any> {
    return this.http.post(`${host}/?Key=WebQueryOnlineDevice`, {}, {});
  }

  connectTo(info: DeviceInfo): void {
    this.browserStorageService.set('deviceInfo', info);
    if (info.Platform === 1) {
      this.deviceService.platform = 'android';
    } else if (info.Platform === 2) {
      this.deviceService.platform = 'iphone';
    }
    this.stopScan();
    
    this.deviceService.host = `${info.PrivateIP}:${info.Port}`;
    this.deviceService.protocol = 'ws:';
    this.deviceService.path = '/channel.do';
    this.deviceService.checkAuthorization();
  }

}
