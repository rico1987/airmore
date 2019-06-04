import { Component, OnInit, Input } from '@angular/core';
import { DeviceService } from '../../../shared/service';

@Component({
  selector: 'app-contact-letter-group',
  templateUrl: './contact-letter-group.component.html',
  styleUrls: ['./contact-letter-group.component.scss']
})
export class ContactLetterGroupComponent implements OnInit {

  @Input() item: any;
  
  constructor(
    private deviceService: DeviceService
  ) {
  }

  ngOnInit() {
  }

  checkItem(contact): void {
    if (this.isSelected(contact)) {
      this.deviceService.removeItems([contact]);
    } else {
      this.deviceService.addItems([contact]);
    }
  }

  isSelected(contact): boolean {
    return this.deviceService.hasItem(contact);
  }

  setActive(contact): void {
    console.log(contact);
    this.deviceService.activeContact = null;
    this.deviceService.isAddingContact = false;
    setTimeout(() => {
      this.deviceService.activeContact = contact;
    }, 0);
  }

}
