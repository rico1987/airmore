import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';

@Component({
  selector: 'app-device-layout',
  templateUrl: './device-layout.component.html',
  styleUrls: ['./device-layout.component.scss']
})
export class DeviceLayoutComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
  ) { }

  ngOnInit() {
  }

}
