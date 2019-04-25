import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

const EventEmitter = require('events');
const W3CWebSocket = require('websocket').w3cwebsocket;
const hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends EventEmitter {

  public connected = false;

  private client = null;

  private heartBeatInterval = 10000;

  private heartBeat = null;

  protected host: string;

  protected protocol: string;

  protected path: string;

  constructor(protected logger: Logger) {
    super();
  }

  init(): void {
    const host = this.host || hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[0];
    const protocol = this.protocol || 'wss:';
    const path = this.path || '/wss';

    if (!this.client) {
      this.client = new W3CWebSocket(`${protocol}//${host}${path}`);

      this.client.onerror = () => {
        this.logger.error('Connection Error');
      };

      this.client.onopen = () => {
        this.logger.log('WebSocket Client Connected');
        this.connected = true;
        this.initHeartBeat();
        this.onOpen();
      };

      this.client.onclose = () => {
        this.connected = false;
        this.logger.warn('echo-protocol Client Closed');
        this.onClose();
      };

      this.client.onmessage = (e) => {
        if (typeof e.data === 'string') {
          this.logger.info(`Received: ${e.data}`);
        }
        this.onMessage(e);
      };
    }
  }

  send(obj: any): void {
    if (this.client && this.client.readyState === this.client.OPEN) {
      if (typeof obj === 'object') {
        this.client.send(JSON.stringify(obj));
      } else {
        this.client.send(obj);
      }
      this.logger.info(`Send message: ${JSON.stringify(obj)}`);
    }
  }

  close(): void {
  }

  onMessage(e: any): void {
    if (typeof e.data === 'string') {
      let obj: object;
      try {
        obj = JSON.parse(e.data);
      } catch (error) {
        this.logger.error(`Can't parse message: ${e.data}`);
      }
      if (obj) {
        const key = obj['Key'];
        const data = obj['Data'];
        this.emit(key, data);
      }
    }
  }

  onOpen(): void {
  }

  onClose(): void {
  }

  initHeartBeat(): void {
    this.heartBeat = setInterval(() => {
      if (this.client.readyState === this.client.OPEN) {
        this.send({Key: 'HeartBeat'});
      }
    }, this.heartBeatInterval);
  }

  clearHeartBeat(): void {
    clearInterval(this.heartBeat);
    this.heartBeat = null;
  }

  setHost(host: string): void {
    this.host = host;
  }

  setProtocol(protocol: string): void {
    this.protocol = protocol;
  }

  setPath(path: string): void {
    this.path = path;
  }
}
