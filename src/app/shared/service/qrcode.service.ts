import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';

const hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];

@Injectable({
  providedIn: 'root'
})
export class QrcodeService extends WebsocketService {

  private qrCodeUrl: string | null;

  getQrCodeUrl(): Promise<any> {
    const host = hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[0];

    return new Promise((resolve) => {
      debugger;
      this.send({
        Key: 'WebCreateQRImage',
        Value: {
          Domain: host,
        }
      });
      this.on('ResponseWebCreateQRImage', (data) => {
        resolve(data);
      });
    });
  }
}
