import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DeviceService {

  connected = false;

  connecting = false;

  constructor() { }

  connect(): void {
  }

  disConnect(): void {
  }
}
