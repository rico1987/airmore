import { Component, Inject } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { AppConfig, APP_DEFAULT_CONFIG } from './config';
import { AppService } from './shared/service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    translate: TranslateService,
    appService: AppService,
    private router: Router,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(this.appConfig.app.fallbackLang);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(this.appConfig.app.defaultLang);

    translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
      appService.setCurrentLang(event.lang);
      
    });
    this.router.navigate(['/connect']);

  }
}
