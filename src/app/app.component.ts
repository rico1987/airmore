import { Component } from '@angular/core';
import { TranslateService, TranslationChangeEvent } from '@ngx-translate/core';
import { AppStateService } from './shared/service/app-state.service';
import { CONFIG } from './config';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  param = {value: 'world'};

  constructor(
    translate: TranslateService,
    appStateService: AppStateService,
  ) {
    // this language will be used as a fallback when a translation isn't found in the current language
    translate.setDefaultLang(CONFIG.app.fallbackLang);

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use(CONFIG.app.defaultLang);

    translate.onTranslationChange.subscribe((event: TranslationChangeEvent) => {
      appStateService.setCurrentLang(event.lang);
    });
  }
}
