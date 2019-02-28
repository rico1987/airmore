import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  private functions: [string];

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }

  setCloudActiveFunction(fun: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others'): void {
    this.activeFunction = fun;
  }
}
