import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  currentFunction: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  private functions: [string];

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }
}
