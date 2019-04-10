import { Component, OnInit } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';

@Component({
  selector: 'app-device-item-list',
  templateUrl: './device-item-list.component.html',
  styleUrls: ['./device-item-list.component.scss']
})
export class DeviceItemListComponent implements OnInit {

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

}
