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
export class WebsocketService extends EventEmitter{

  private client = null;

  private heartBeatInterval = 10000;

  private heartBeat = null;

  constructor(private logger: Logger) {
    super();
    const host = hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || hosts[0];
    const protocol = 'wss:';
    const path = '/wss';

    this.client = new W3CWebSocket(`${protocol}//${host}${path}`);

    this.client.onerror = () => {
      logger.error('Connection Error');
    };

    this.client.onopen = () => {
      logger.log('WebSocket Client Connected');
      this.initHeartBeat();
      this.onOpen();
    };

    this.client.onclose = () => {
      logger.warn('echo-protocol Client Closed');
      this.onClose();
    };

    this.client.onmessage = (e) => {
      if (typeof e.data === 'string') {
        logger.log(`Received: ${e.data}`);
      }
      this.onMessage(e);
    };
  }

  send(obj: any): void {
    if (this.client && this.client.readyState === this.client.OPEN) {
      if (typeof obj === 'object') {
        this.client.send(JSON.stringify(obj));
      } else {
        this.client.send(obj);
      }
      this.logger.log(`Send message: ${JSON.stringify(obj)}`);
    }
  }

  close(): void {
  }

  onMessage(e: any): void {
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
}
