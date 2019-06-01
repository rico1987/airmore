import { Component, OnInit } from '@angular/core';
import { BrowserStorageService } from '../../service/storage.service';

const W3CWebSocket = require('websocket').w3cwebsocket;


@Component({
  selector: 'app-reflector-modal',
  templateUrl: './reflector-modal.component.html',
  styleUrls: ['./reflector-modal.component.scss']
})
export class ReflectorModalComponent implements OnInit {

  ws: WebSocket = null;

  screenshot: string = null;

  isFullscreen: boolean = false;

  showGuid: boolean = true;

  rotation: number = 0;

  widthWithoutRotation = 360;

  width = 360;

  height = 640;

  defaultWidth = 360;

  defaultHeight = 640;

  frame: string = null;

  constructor(
    private browserStorageService: BrowserStorageService
  ) { }

  ngOnInit() {
    this.screenshot = this.browserStorageService.get('screenshot');
    this.startReflector();
  }
  

  initWebSocket(): void {
    this.closeWebSocket();
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    const wsUrl = `ws://${deviceInfo.PrivateIP}:${deviceInfo.Port}/mirror.do`;
    this.ws = new W3CWebSocket(wsUrl);
    this.ws.binaryType = 'arraybuffer';
    this.ws.onopen = this.onWsOpen.bind(this);
    this.ws.onmessage = this.onWsMessage.bind(this);
    this.ws.onclose = this.onWsClose.bind(this);
  }

  onWsOpen(): void {
  }

  onWsMessage(e): void {
    const bytes = new Uint8Array(e.data)
    console.log(e.data);
    let data = []
    const length = bytes.length
    console.log(bytes);

    for (let i = 0; i < length; i++) {
      data[i] = String.fromCharCode(bytes[i]);
    }
    console.log(data);
    
    let dataStr = data.join('');

    if (dataStr.slice(0, 4) === 'cmd-') {
      if (dataStr.indexOf('cmd-GetMP-Resp:') == 0) {
        var result = dataStr.charAt(data.length - 1)
        if (result == '0') {
          this.initWebSocket();
        }
      } else if (dataStr.indexOf('cmd-Rotation-Resp:') == 0) {
        const rotation = (dataStr.charAt(dataStr.length - 1) as unknown as number) % 2;
        if (rotation !== this.rotation) {
          this.rotation = rotation;
          console.log(this.rotation);
          this.bestSize();
          this.center();
        }
      }
    } else {
      this.showGuid = false;
      this.frame = 'data:image/png;base64,' + window.btoa(dataStr);
      console.log(this.frame);
    }
    
    
  }

  bestSize(): void {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    var a = (deviceInfo.Resolution || '').split('*')
    var w = Number(a[0])
    var h = Number(a[1])

    if (this.isFullscreen) {
      if (!w || !h) {
        w = this.defaultWidth
        h = this.defaultHeight
      }
    }
    else if (w && h && w > this.defaultWidth) {
      h *= this.defaultWidth / w
      w = this.defaultWidth
    }
    else {
      w = this.defaultWidth
      h = this.defaultHeight
    }

    if (this.rotation === 1) {
      var temp = w
      w = h
      h = temp
    }

    var aw = document.documentElement.clientWidth  - (this.isFullscreen ? 0 : 40)
    var ah = document.documentElement.clientHeight - (this.isFullscreen ? 106 : 40 + 85)

    if (w > aw) {
      h *= aw / w
      w = aw
    }

    if (h > ah) {
      w *= ah / h
      h = ah
    }

    w = Math.round(w)
    h = Math.round(h)

    var widthWithoutRotation = this.rotation === 1 ? h : w
    if (widthWithoutRotation !== this.widthWithoutRotation) {
      this.setFrameWidth(widthWithoutRotation);
    }

    this.widthWithoutRotation = widthWithoutRotation
    this.width = w
    this.height = h
  }

  setFrameWidth (width: number) {
    if (this.ws && this.ws.readyState === this.ws.OPEN) {
      this.ws.send(`cmd-Resolution-Req:${width}`);
    }
  }

  center(): void {

  }

  onWsClose(): void {

  }

  startReflector(): void {
    this.showGuid = true;
    this.initWebSocket();
  }

  endReflector(): void {
    this.closeWebSocket();
  }

  closeWebSocket(): void {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}
