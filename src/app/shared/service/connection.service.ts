import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { DeviceService } from './device.service';

const hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];

@Injectable({
  providedIn: 'root'
})
export class ConnectionService extends WebsocketService {

  private _activeConnectionType: 'qrcode' | 'radar' | 'account';
  public get activeConnectionType(): 'qrcode' | 'radar' | 'account' {
    return this._activeConnectionType;
  }
  public set activeConnectionType(value: 'qrcode' | 'radar' | 'account') {
    this._activeConnectionType = value;
  }

  constructor(
    private browserStorageService: BrowserStorageService,
    private deviceService: DeviceService,
    private log: Logger,
  ) {
    super(log);
    this.activeConnectionType = 'qrcode';
  }

  /**
   * 获取连接二维码
   */
  getQrCodeUrl(): Promise<any> {
    const host = hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[1];

    return new Promise((resolve) => {
      this.send({
        Key: 'WebCreateQRImage',
        Value: {
          Domain: host,
        }
      });
      this.on('ResponseWebCreateQRImage', (data) => {
        resolve(data);
        this.browserStorageService.set('hash', data.ID.substr(data.ID.lastIndexOf(':') + 1));
      });
      this.on('ResponseWebQueryOnlineDev', (data) => {
        this.clearHeartBeat();
        this.browserStorageService.set('deviceInfo', data);
        if (data.Platform === 1) {
          this.deviceService.platform = 'android';
        } else if (data.Platform === 2) {
          this.deviceService.platform = 'iphone';
        }
        this.send({
          Key: 'WebCloseSocket',
        });
        this.deviceService.host = `${data.PrivateIP}:${data.Port}`;
        this.deviceService.protocol = 'ws:';
        this.deviceService.path = '/channel.do';
        this.deviceService.init();
      });
    });
  }
}
