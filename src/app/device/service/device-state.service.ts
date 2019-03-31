import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
    providedIn: 'root'
})
export class DeviceStateService {

    activeFunction: 'photo' | 'music' | 'video' | 'contact' | 'message' | 'apps' | 'doc' | 'file' |
        'reflector' | 'tools' | 'cloud';

    functions: Array<any>;

    constructor(
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    ) {
        this.functions = appConfig.app.deviceFunctions;
    }

    setActiveFunction(fun: 'photo' | 'music' | 'video' | 'contact' | 'message' | 'apps' | 'doc' | 'file' | 'reflector'
    | 'tools' | 'cloud' | any): void {
        this.activeFunction = fun;
    }
}

