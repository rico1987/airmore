import { InjectionToken } from '@angular/core';

export interface AppConfig {
    app?: {
        defaultLang: string,
        fallbackLang: string,
        isDebug: boolean,
        appFunctions: [string],
        androidDesktopFunctions: [string],
        iosDesktopFunctions: [string],
        androidSidebarFunctions: [string],
        iosSidebarFunctions: [string],
        cloudFunctions: [string],
        accountStorageKey: string,
        authStorageKey: string,
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
            // tslint:disable-next-line
            appFunctions: ['pictures' , 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'reflector', 'tool', 'clipboard', 'cloud'],
            androidDesktopFunctions: ['pictures' , 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'reflector', 'tool', 'clipboard', 'cloud'],
            iosDesktopFunctions: ['pictures' , 'musics', 'videos', 'apps', 'documents', 'files', 'reflector', 'tools', 'clipboard', 'cloud'],
            // tslint:disable-next-line
            androidSidebarFunctions: ['pictures' , 'musics', 'videos', 'contacts', 'messages', 'apps', 'documents', 'files', 'clipboard', 'cloud'],
            iosSidebarFunctions: ['pictures' , 'musics', 'videos', 'documents', 'files', 'clipboard', 'cloud'],
            cloudFunctions: ['clouds', 'pictures', 'musics', 'videos', 'documents', 'others'],
            accountStorageKey: 'userInfo',
            authStorageKey: 'cloudAuth',
            cloudStorageKey: 'cloudUserInfo',
            cloudItemsPerPage: 50,
            messageInterval: 1000,
        },
        brand: 'Apowersoft',
    }
};
