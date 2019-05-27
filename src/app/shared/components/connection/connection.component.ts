import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { ConnectionService } from '../../service/connection.service';
import { DeviceService } from '../../service/device.service';
import { ModalService } from '../../service/modal';
import { InstallationModalComponent } from '../installation-modal/installation-modal.component';
import { RadarComponent } from '../radar/radar.component';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  @ViewChild('radarElement') radarElement: ElementRef<RadarComponent>;

  qrCodeUrl: string | null;

  private isLoadingQrCode = false;

  private _interval: any = null;

  private _activeConnectionType: 'qrcode' | 'radar' | 'account' = 'qrcode';
  public get activeConnectionType(): 'qrcode' | 'radar' | 'account' {
    return this._activeConnectionType;
  }
  public set activeConnectionType(value: 'qrcode' | 'radar' | 'account') {
    this._activeConnectionType = value;
  }


  constructor(
    private deviceService: DeviceService,
    private connectionService: ConnectionService,
    private modalService: ModalService,
    ) {}

  ngOnInit() {
    this.getQrCode();
  }

  changeConnectionType(connectionType: 'qrcode' | 'radar' | 'account'): void {
    this.connectionService.activeConnectionType = connectionType;
    this.activeConnectionType = connectionType;
    if (connectionType === 'qrcode') {
      this.getQrCode();
      this.deviceService.stopScan();
    } else if (connectionType === 'radar') {
      this.deviceService.scan();
    } else if (connectionType === 'account') {
      this.deviceService.stopScan();
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

  showInstallModal(): void {
    const installModal = this.modalService.create({
      amTitle: '<i>安装爱莫助手应用</i>',
      amContent: InstallationModalComponent,
      amFooter: [
        {
          label: 'OK',
          onClick: componentInstance => {
            installModal.close();
          }
        }
      ],
      amMaskClosable: false,
      amClosable: true,
      amMask: true,
      amOnOk: () => {

      }
    });
  }

  hide(): void {

  }
}
