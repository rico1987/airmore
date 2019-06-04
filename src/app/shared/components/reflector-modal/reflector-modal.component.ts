import {
  ConnectionPositionPair,
  FlexibleConnectedPositionStrategy,
  Overlay,
  OverlayConfig,
  OverlayRef
} from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { Component, OnInit, Input, ElementRef, ViewChild, } from '@angular/core';
import { BrowserStorageService,  } from '../../service/storage.service';
import { MessageService } from '../../service/message.service';
import { DropdownSelectOptionsComponent } from '../dropdown-select-options/dropdown-select-options.component';

const W3CWebSocket = require('websocket').w3cwebsocket;


@Component({
  selector: 'app-reflector-modal',
  templateUrl: './reflector-modal.component.html',
  styleUrls: ['./reflector-modal.component.scss']
})
export class ReflectorModalComponent implements OnInit {

  @Input() onClose: any;

  @Input() onResize: any;

  @Input() onSaveToPhone: any;

  @Input() onFullScreen: any;

  @ViewChild('settingBtn') settingBtn: ElementRef;

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

  private _overlayRef: OverlayRef | null;

  constructor(
    private overlay: Overlay,
    private ref: ElementRef,
    private browserStorageService: BrowserStorageService,
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

  close(): void {
    this.onClose();
  }

  resize(): void {
    this.onResize();
  }

  onWsMessage(e): void {
    const bytes = new Uint8Array(e.data)
    let data = []
    const length = bytes.length

    for (let i = 0; i < length; i++) {
      data[i] = String.fromCharCode(bytes[i]);
    }
    
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
          this.bestSize();
          this.center();
        }
      }
    } else {
      this.showGuid = false;
      this.frame = 'data:image/png;base64,' + window.btoa(dataStr);
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

  capture(): void {
    const method = this.browserStorageService.get('screenshotSaveMethod');
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    if (method === 'save') {
      this.onSaveToPhone();
    } else if (method === 'download') {
      const url = `http://${deviceInfo.PrivateIP}:${deviceInfo.Port}?Key=MirrorScreenShot&NextStep=Download`;
      const form = document.createElement('form');
      form.setAttribute('target', '_blank');
      form.setAttribute('method', 'post');
      form.setAttribute('action', url);
      document.body.append(form);
      form.submit();
      document.body.removeChild(form);
    }
  }

  fullScreen(): void {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      if(document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
      }
      this.onFullScreen(true);
      this.bestSize();
    } else {
      this.onFullScreen(false);
    }
    
  }

  openSetting($event: MouseEvent): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
    this._overlayRef = this.overlay.create(
      new OverlayConfig({
        scrollStrategy: this.overlay.scrollStrategies.close(),
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.settingBtn)
          .withPositions([{
            originX: 'start',
            originY: 'bottom',
            overlayX: 'center',
            overlayY: 'top',
            offsetX: 0,
            offsetY: -100
          }])
      })
    );
    const instance = this._overlayRef.attach(new ComponentPortal(DropdownSelectOptionsComponent)).instance;
    instance.options = [
      {
        key: 'save',
        value: 'save',
        label: 'Save Screenshot to phone',
      },
      {
        key: 'download',
        value: 'download',
        label: 'Save Screenshot to computer',
      },
    ];
    instance.multiple = false;
    instance.default = [this.browserStorageService.get('screenshotSaveMethod')];
    instance.onValueChange = (options: Array<any>) => {
      this.browserStorageService.set('screenshotSaveMethod', options[0]['key']);
    }
    instance.showIcon = true;
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => !!this._overlayRef && !this._overlayRef.overlayElement.contains(event.target as HTMLElement) && event.target !== $event.target),
        take(1)
      )
      .subscribe(() => instance.close());
    event.stopPropagation();
  }
}
