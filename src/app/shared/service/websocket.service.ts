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

  constructor(private logger: Logger) {
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

  initChannel(protocol:string, host: string, path: string): void {
    if (!this.channelClient) {
      this.channelClient = new W3CWebSocket(`${protocol}//${host}${path}`);

      this.channelClient.onerror = () => {
        this.logger.error('Connection Error');
      };

      this.channelClient.onopen = () => {
        this.logger.log('WebSocket Client Connected');
        this.channelConnected = true;
        this.initHeartBeat();
        this.onChannelOpen();
      };

      this.channelClient.onclose = () => {
        this.channelConnected = false;
        this.logger.warn('Websocket Client Closed');
        this.onChannelClose();
      };

      this.channelClient.onmessage = (e) => {
        if (typeof e.data === 'string') {
          this.logger.info(`Received: ${e.data}`);
        }
        this.onChannelMessage(e);
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

  channelSend(obj: any): void {
    if (this.channelClient && this.channelClient.readyState === this.channelClient.OPEN) {
      if (typeof obj === 'object') {
        this.channelClient.send(JSON.stringify(obj));
      } else {
        this.channelClient.send(obj);
      }
      this.logger.info(`Send message: ${JSON.stringify(obj)}`);
    }
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

  onChannelOpen(): void {}

  onChannelClose(): void {}

  onChannelMessage(e: any): void {
    if (typeof e.data === 'string') {
      let obj: object;
      try {
        obj = JSON.parse(e.data);
      } catch (error) {
        this.logger.error(`Can't parse message: ${e.data}`);
      }
      if (obj) {
        const name = obj['Name'];
        const msg = obj['Msg'];
        this.emit(name, msg);
      }
    }
  }

  initHeartBeat(): void {
    this.heartBeat = setInterval(() => {
      if (this.channelClient.readyState === this.channelClient.OPEN) {
        this.channelSend({Key: 'HeartBeat'});
      }
    }, this.heartBeatInterval);
  }

  clearHeartBeat(): void {
    clearInterval(this.heartBeat);
    this.heartBeat = null;
  }


  public connected = false;

  private _channelClient: WebSocket = null;
  public get channelClient(): WebSocket {
    return this._channelClient;
  }
  public set channelClient(value: WebSocket) {
    this._channelClient = value;
  }


  private _client: WebSocket = null;
  public get client(): WebSocket {
    return this._client;
  }
  public set client(client: WebSocket) {
    this._client = client;
  }

  private _heartBeatInterval = 10000;
  public get heartBeatInterval() {
    return this._heartBeatInterval;
  }
  public set heartBeatInterval(value) {
    this._heartBeatInterval = value;
  }

  private _heartBeat: any = null;
  public get heartBeat(): any {
    return this._heartBeat;
  }
  public set heartBeat(value: any) {
    this._heartBeat = value;
  }

  private _host: string;
  public get host(): string {
    return this._host;
  }
  public set host(value: string) {
    this._host = value;
  }

  private _protocol: string;
  public get protocol(): string {
    return this._protocol;
  }
  public set protocol(value: string) {
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
