import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';

@Component({
  selector: 'app-connection',
  templateUrl: './connection.component.html',
  styleUrls: ['./connection.component.scss']
})
export class ConnectionComponent implements OnInit {

  activeConnectionType = 'qrcode'; // 当前连接方式, 可选值 'qrcode', 'radar', 'account'

  constructor(deviceService: DeviceService) { }

  ngOnInit() {
  }

  changeConnectionType(connectionType: string): void {
    this.activeConnectionType = connectionType;
  }

  getQrCode(): void {
  }

}
