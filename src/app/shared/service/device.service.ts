import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  connected = false;

  connecting = false;

  constructor(
    private logger: Logger,
    private websocketService: WebsocketService,
  ) { }

  connect(): void {
  }

  disConnect(): void {
  }

  getQrcode(): void {

  }
}
