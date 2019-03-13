import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../service/app-state.service';
import { QrcodeService } from '../../service/qrcode.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  qrCodeUrl: string | null;

  private loadingQrCode = false;

  constructor(
    private appStateService: AppStateService,
    private qrcodeService: QrcodeService,
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

  accountLogin(): void {
  }

}
