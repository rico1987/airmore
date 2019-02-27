import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';

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


  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }

  ngOnInit() {
  }

}
