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
export class ConnectionService extends WebsocketService{

  constructor(
    private browserStorageService: BrowserStorageService,
    private deviceService: DeviceService,
    protected logger: Logger,
  ) {
    super(logger);
  }

  /**
   * 获取连接二维码
   */
  getQrCodeUrl(): Promise<any> {
    const host = hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[0];

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
        this.send({
          Key: 'WebCloseSocket',
        });
        this.deviceService.setHost(`${data.PrivateIP}:${data.Port}`);
        this.deviceService.setProtocol('ws:');
        this.deviceService.setPath('/channel.do');
        this.deviceService.init();
      });
    });
  }
}