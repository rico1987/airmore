import { Component, OnInit } from '@angular/core';
import { AppStateService, DeviceStateService, CloudStateService } from '../../../shared/service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
  }

  setActiveViewMode(viewMode: 'list' | 'grid'): void {
    this.appStateService.setActiveViewMode(viewMode);
  }

  get title(): string {
    if (this.appStateService.currentModule === 'cloud') {
      return 'ApowerCloud';
    } else {
      return this.deviceStateService.activeFunction;
    }
  }
}
