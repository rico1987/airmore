import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../service/device.service';
@Component({
  selector: 'app-subheader-dropdown',
  templateUrl: './subheader-dropdown.component.html',
  styleUrls: ['./subheader-dropdown.component.scss']
})
export class SubheaderDropdownComponent implements OnInit {

  show = true;

  constructor(
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  importFile(): void {
    this.deviceService.importFile();
  }

  importFolder(): void {
    this.deviceService.importFolder();
  }

  close(): void {
    this.show = false;
  }
}
