import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  functions: [string];

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = appConfig.app.functions;
  }

  ngOnInit() {
  }

}
