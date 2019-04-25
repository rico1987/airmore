import { Injectable, TemplateRef, Inject } from '@angular/core';
import { Message } from '../models/message.model';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

export class MessageBaseService<> {

}

@Injectable()
export class MessageService {

    private _interval: any = null;

    private _instances: Array<any>;

    private _type: string;

    private _currentZIndex = 2000;

    constructor(
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) { }

    private _push(message: Message): void {
        this._instances.push(message);
    }

    private _pop(): void {
        if (!this._interval) {
            this._interval = setInterval(() => {
                if (this._instances.length === 0) {
                    clearInterval(this._interval);
                }
            }, this.appConfig.app.messageInterval);
        }
    }

    success(msg: string): void {
        this._push({
            message: msg,
            type: 'success',
        });
        this._pop();
    }

    warning(msg: string): void {
        this._push({
            message: msg,
            type: 'warning',
        });
        this._pop();
    }

    error(msg: string): void {
        this._push({
            message: msg,
            type: 'error',
        });
        this._pop();
    }

    closeAll(): void {}

    private _nextZIndex(): number {
        return this._currentZIndex ++;
    }

}
