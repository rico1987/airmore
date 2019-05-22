import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  functions: [string];

  constructor(
    private deviceStateService: DeviceStateService,
    private appStateService: AppStateService,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private router: Router,
  ) {
    // android and ios have different functions
    if (this.appStateService.platform === 'iphone') {
      this.functions = appConfig.app.iosSidebarFunctions;
    } else if (this.appStateService.platform === 'android') {
      this.functions = appConfig.app.androidSidebarFunctions;
    }
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'clipboard' | 'cloud'): void {
    if (fun !== 'cloud') {
      this.appStateService.setCurrentModule('device');
      this.router.navigate(
        ['device']
      );
      this.deviceStateService.setDeviceActiveFunction(fun);
    } else {
      this.appStateService.setCurrentModule('cloud');
      this.router.navigate(
        ['cloud']
      );
    }
  }

  gotoDesktop(): void {
    this.router.navigate(
      ['desktop']
    );
  }

}
