import { Component, OnInit } from '@angular/core';
import { QrcodeService } from '../../service/qrcode.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  activeConnectionType = 'qrcode'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  qrCodeUrl: string | null;

  private loadingQrCode = false;

  constructor(private qrcodeService: QrcodeService) {}

  ngOnInit() {
    this.getQrCode();
  }

  changeConnectionType(connectionType: string): void {
    this.activeConnectionType = connectionType;
  }

  getQrCode(): void {
    this.qrcodeService.getQrCodeUrl()
      .then((res) => {
        if (res.URL) {
          this.qrCodeUrl = res.URL;
        }
      })
      .catch((e) => {
        console.log(e);
      });
  }

}
