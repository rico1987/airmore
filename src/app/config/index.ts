import { InjectionToken } from '@angular/core';

export interface AppConfig {
    app?: {
        defaultLang: string,
        fallbackLang: string,
        isDebug: boolean,
        appFunctions: [string],
        androidSidebarFunctions: [string],
        iphoneSidebarFunctions: [string],
        cloudFunctions: [string],
        accountStorageKey: string,
        cloudStorageKey: string,
        cloudItemsPerPage: number,
        messageInterval: number,
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
            appFunctions: ['pictures' , 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'reflector', 'tools', 'cloud'],
            androidSidebarFunctions: ['pictures' , 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'clipboard', 'cloud'],
            iosSidebarFunctions: ['pictures' , 'musics', 'videos', 'documents', 'files', 'clipboard', 'cloud'],
            cloudFunctions: ['clouds', 'pictures', 'musics', 'videos', 'documents', 'others'],
            accountStorageKey: 'userInfo',
            cloudStorageKey: 'cloudUserInfo',
            cloudItemsPerPage: 50,
            messageInterval: 1000,
        },
        brand: 'Apowersoft',
    }
}
