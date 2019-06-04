import { Component, OnInit } from '@angular/core';
import { DeviceService } from '../../../shared/service';

@Component({
  selector: 'app-uploading-progress',
  templateUrl: './uploading-progress.component.html',
  styleUrls: ['./uploading-progress.component.scss']
})
export class UploadingProgressComponent implements OnInit {

  show: boolean = true;

  constructor(
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
  }

  close(): void {
    this.show = false;
  }
}
