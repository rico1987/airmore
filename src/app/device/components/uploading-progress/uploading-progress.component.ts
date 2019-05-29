import { Component, OnInit } from '@angular/core';
import { DeviceStateService } from '../../../shared/service';

@Component({
  selector: 'app-uploading-progress',
  templateUrl: './uploading-progress.component.html',
  styleUrls: ['./uploading-progress.component.scss']
})
export class UploadingProgressComponent implements OnInit {

  show: boolean = true;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.show = false;
  }
}
