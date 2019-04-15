import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';

@Component({
  selector: 'app-device-item',
  templateUrl: './device-item.component.html',
  styleUrls: ['./device-item.component.scss']
})
export class DeviceItemComponent implements OnInit {

  @Input() item: any;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

  checkItem(): void {

  }

  openResource(): void {

  }

  preview(): void {}

  download(): void {}

  delete(): void {
  }
  
  supportOperation(operation: 'preview' | 'download' | 'delete'): boolean {
    return true;
  }

}
