import { Component, OnInit } from '@angular/core';
import { AppStateService, DeviceStateService } from '../../../shared/service';

@Component({
  selector: 'app-device-layout',
  templateUrl: './device-layout.component.html',
  styleUrls: ['./device-layout.component.scss']
})
export class DeviceLayoutComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

}
