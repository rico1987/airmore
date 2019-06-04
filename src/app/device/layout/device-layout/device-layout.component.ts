import { Component, OnInit } from '@angular/core';
import { AppService, DeviceService } from '../../../shared/service';

@Component({
  selector: 'app-device-layout',
  templateUrl: './device-layout.component.html',
  styleUrls: ['./device-layout.component.scss']
})
export class DeviceLayoutComponent implements OnInit {

  constructor(
    private appService: AppService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

}
