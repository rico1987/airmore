import { InjectionToken } from '@angular/core';

export interface AppConfig {
    app?: {
        defaultLang: string,
        fallbackLang: string,
        isDebug: boolean,
        functions: [string],
        cloudFunctions: [string],
        accountStorageKey: string,
        cloudStorageKey: string,
    };
    brand?: string;
}

export const APP_DEFAULT_CONFIG = new InjectionToken<AppConfig>('APP_DEFAULT_CONFIG');

export const APP_DEFAULT_CONFIG_PROVIDER = {
    provide: APP_DEFAULT_CONFIG,
    useValue: {
        app: {
            defaultLang: 'en',
            fallbackLang: 'en',
            isDebug: true,
            functions: ['pictures', 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'cloud'],
            cloudFunctions: ['clouds', 'pictures', 'musics', 'videos', 'documents', 'others'],
            accountStorageKey: 'userInfo',
            cloudStorageKey: 'cloudUserInfo',
        },
        brand: 'Apowersoft',
    }
}
