// websocket 封装
import { Injectable } from '@angular/core';
import { Logger } from './logger.service';

const EventEmitter = require('events');
const W3CWebSocket = require('websocket').w3cwebsocket;
export const Hosts = [
  'airmore.com',
  'airmore.cn',
  'airmore.jp'
];

@Injectable({
  providedIn: 'root'
})
export class WebsocketService extends EventEmitter {

  constructor(protected logger: Logger) {
    super();
  }

  init(): void {
    const host = this.host || Hosts.find((ele) => location.hostname.toLowerCase().includes(ele)) || Hosts[1];
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
        this.logger.warn('Websocket Client Closed');
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


  public connected = false;

  private _client = null;
  public get client() {
    return this._client;
  }
  public set client(value) {
    this._client = value;
  }

  private _heartBeatInterval = 10000;
  public get heartBeatInterval() {
    return this._heartBeatInterval;
  }
  public set heartBeatInterval(value) {
    this._heartBeatInterval = value;
  }

  private _heartBeat = null;
  public get heartBeat() {
    return this._heartBeat;
  }
  public set heartBeat(value) {
    this._heartBeat = value;
  }

  private _host: string;
  protected get host(): string {
    return this._host;
  }
  protected set host(value: string) {
    this._host = value;
  }

  private _protocol: string;
  protected get protocol(): string {
    return this._protocol;
  }
  protected set protocol(value: string) {
    this._protocol = value;
  }

  private _path: string;
  public get path(): string {
    return this._path;
  }
  public set path(value: string) {
    this._path = value;
  }
}
