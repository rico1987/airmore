import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../../device/service/device-state.service';

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
  ) {
    // android and ios have different functions
    if (this.appStateService.platform === 'iphone') {
      this.functions = appConfig.app.iphoneSidebarFunctions;
    }
    this.functions = appConfig.app.androidSidebarFunctions;
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'pictures' | 'musics' | 'videos' | 'contacts' | 'messages' | 'apps' | 'documents' | 'files' | 'reflector' | 'tools' | 'clipboard' | 'cloud'): void {
    if (fun !== 'cloud') {
      this.deviceStateService.setDeviceActiveFunction(fun);
    }
  }

}
