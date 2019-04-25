import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { ConnectionService } from '../../service/connection.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  qrCodeUrl: string | null;

  private isLoadingQrCode = false;

  private _interval: any = null;

  constructor(
    private appStateService: AppStateService,
    private connectionService: ConnectionService,
    ) {}

  ngOnInit() {
    this.getQrCode();
  }

  changeConnectionType(connectionType: string): void {
    this.appStateService.changeConnectionType(connectionType);
    if (connectionType === 'qrcode') {
      this.getQrCode();
    }
  }

  /**
   * 获取二维码
   */
  getQrCode(): void {
    this.isLoadingQrCode = true;
    this.connectionService.init();
    this._interval = window.setInterval(() => {
      if (this.connectionService.connected) {
        this.connectionService.getQrCodeUrl()
          .then((res) => {
            if (res.URL) {
              this.isLoadingQrCode = false;
              this.qrCodeUrl = res.URL;
              clearInterval(this._interval);
              this._interval = null;
            }
          })
          .catch((e) => {
            console.log(e);
          });
      }
    }, 1000);
  }
}
