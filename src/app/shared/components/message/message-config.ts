import { InjectionToken } from '@angular/core';

export interface MessageConfig {
    animate?: boolean;
    duration?: number;
    maxStack?: number;
    pauseOnHover?: boolean;
    top?: number | string;

    [index: string]: any; 
}

export const MESSAGE_DEFAULT_CONFIG = new InjectionToken<MessageConfig>('MESSAGE_DEFAULT_CONFIG');

export const MESSAGE_CONFIG = new InjectionToken<MessageConfig>('MESSAGE_CONFIG');

export const MESSAGE_DEFAULT_CONFIG_PROVIDER = {
    provide: MESSAGE_DEFAULT_CONFIG,
    useValue: {
      animate: true,
      duration: 3000,
      maxStack: 7,
      pauseOnHover: true,
      top: 24
    }
};