import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../shared/service';
import { ImageGroup } from '../../models';

@Component({
  selector: 'app-device-item-group',
  templateUrl: './device-item-group.component.html',
  styleUrls: ['./device-item-group.component.scss']
})
export class DeviceItemGroupComponent implements OnInit {

  @Input() group: ImageGroup;

  constructor(
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  select() {
    if (this.isChecked) {
      this.group.items.forEach((ele) => {
        this.deviceService.removeItems([ele]);
      })
    } else {
      this.group.items.forEach((ele) => {
        this.deviceService.addItems([ele]);
      })
    }
  }

  get isChecked(): boolean {
    let flag = true;
    if (this.group.items && this.group.items.some((ele) => !this.deviceService.hasItem(ele))) {
      flag = false;
    }
    return flag;
  }

}
