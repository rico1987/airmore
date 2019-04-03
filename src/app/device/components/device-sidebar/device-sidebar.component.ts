import { Component, OnInit } from '@angular/core';
import { AppStateService } from '../../../shared/service/app-state.service';

@Component({
  selector: 'app-device-sidebar',
  templateUrl: './device-sidebar.component.html',
  styleUrls: ['./device-sidebar.component.scss']
})
export class DeviceSidebarComponent implements OnInit {

  constructor(
    private appStateService: AppStateService,
  ) { }

  ngOnInit() {
  }

}
