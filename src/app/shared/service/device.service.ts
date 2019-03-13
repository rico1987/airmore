import { Injectable } from '@angular/core';
import { Logger } from './logger.service';
import { WebsocketService } from './websocket.service';
import { BrowserStorageService } from './storage.service';
import { AppStateService } from './app-state.service';

const hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];

@Injectable({
  providedIn: 'root'
})
export class DeviceService extends WebsocketService{

  constructor(
    private browserStorageService: BrowserStorageService,
    private appStateService: AppStateService,
    protected logger: Logger,
  ) {
    super(logger);
  }

  init() {
    super.init();
  }
}
