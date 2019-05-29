import { Component, OnInit } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
@Component({
  selector: 'app-subheader-dropdown',
  templateUrl: './subheader-dropdown.component.html',
  styleUrls: ['./subheader-dropdown.component.scss']
})
export class SubheaderDropdownComponent implements OnInit {

  show = true;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

  importFile(): void {
    this.deviceStateService.importFile();
  }

  importFolder(): void {
    this.deviceStateService.importFolder();
  }

  close(): void {
    this.show = false;
  }
}
