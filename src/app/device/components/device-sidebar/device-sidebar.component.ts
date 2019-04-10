import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service/device-state.service';

@Component({
  selector: 'app-device-sidebar',
  templateUrl: './device-sidebar.component.html',
  styleUrls: ['./device-sidebar.component.scss']
})
export class DeviceSidebarComponent implements OnInit {

  itemList: Array<any> = [];

  constructor(
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
    this.deviceStateService.getSidebarItemList()
      .subscribe((data) => { 
        this.itemList = data;
      });
  }
}
