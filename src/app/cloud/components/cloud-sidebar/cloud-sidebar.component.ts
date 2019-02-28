import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { CloudStateService } from '../../service/cloud-state.service';

@Component({
  selector: 'app-cloud-sidebar',
  templateUrl: './cloud-sidebar.component.html',
  styleUrls: ['./cloud-sidebar.component.scss']
})
export class CloudSidebarComponent implements OnInit {

  functions: [string];

  functionNameMap = {
    'clouds': 'Cloud Files',
    'pictures': 'Pictures',
    'musics': 'Music',
    'videos': 'Videos',
    'documents': 'Documents',
    'others': 'Others',
  };

  activeFunction: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';


  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudStateService: CloudStateService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }

  ngOnInit() {
  }

  setCloudActiveFunction(fun: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others'): void {
    this.activeFunction = fun;
    this.cloudStateService.setCloudActiveFunction(fun);
  }
}
