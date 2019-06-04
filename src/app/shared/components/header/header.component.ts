import { Component, OnInit } from '@angular/core';
import { AppService, DeviceService, CloudStateService } from '../../../shared/service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private appService: AppService,
    private deviceService: DeviceService,
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
  }

  setActiveViewMode(viewMode: 'list' | 'grid'): void {
    this.appService.setActiveViewMode(viewMode);
  }

  get title(): string {
    if (this.appService.currentModule === 'cloud') {
      return 'ApowerCloud';
    } else {
      return this.deviceService.activeFunction;
    }
  }
}
