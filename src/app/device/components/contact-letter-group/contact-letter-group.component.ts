import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';

@Component({
  selector: 'app-contact-letter-group',
  templateUrl: './contact-letter-group.component.html',
  styleUrls: ['./contact-letter-group.component.scss']
})
export class ContactLetterGroupComponent implements OnInit {

  @Input() item: any;
  
  constructor(
    private deviceStateService: DeviceStateService
  ) {
  }

  ngOnInit() {
  }

  checkItem(contact): void {
    if (this.isSelected(contact)) {
      this.deviceStateService.removeItems([contact]);
    } else {
      this.deviceStateService.addItems([contact]);
    }
  }

  isSelected(contact): boolean {
    return this.deviceStateService.hasItem(contact);
  }

}
