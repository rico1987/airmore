import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { AppStateService } from '../../service/app-state.service';
import { DeviceStateService } from '../../../device/service/device-state.service';

@Component({
  selector: 'app-desktop',
  templateUrl: './desktop.component.html',
  styleUrls: ['./desktop.component.scss']
})
export class DesktopComponent implements OnInit {

  functions: Array<string>;

  constructor(
    private router: Router,
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
  ) {
    this.functions = this.appConfig.app.functions;
  }

  ngOnInit() {
  }

  setActiveFunction(fun: 'photo' | 'music' | 'video' | 'contact' | 'message' | 'apps' | 'doc' | 'file' |
  'reflector' | 'tools' | 'cloud'): void {
    if (fun !== 'cloud') {
      this.appStateService.setCurrentModule('device');
      this.deviceStateService.setActiveFunction(fun);
      this.router.navigate(
        ['device']
      );
    } else {
      this.appStateService.setCurrentModule('cloud');
      this.router.navigate(
        ['cloud']
      );
    }
  }

}
