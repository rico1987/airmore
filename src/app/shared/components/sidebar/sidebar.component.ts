import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../../shared/service/app-state.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  functions: [string];

  constructor(
    private appStateService: AppStateService,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = appConfig.app.sidebarFunctions;
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' | 'cloud'): void {
    this.appStateService.setActiveFunction(fun);
  }

}
