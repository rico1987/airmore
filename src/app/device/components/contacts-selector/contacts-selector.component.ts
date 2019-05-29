import { Component, OnInit } from '@angular/core';
import { DeviceStateService } from '../../../shared/service/device-state.service';
@Component({
  selector: 'app-contacts-selector',
  templateUrl: './contacts-selector.component.html',
  styleUrls: ['./contacts-selector.component.scss']
})
export class ContactsSelectorComponent implements OnInit {

  private show = true;

  private contactGroupList: Array<any>;

  private activeGroup;

  private contactList: Array<any>;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
    this.contactGroupList = this.deviceStateService.contactGroupList.concat();
    this.activeGroup = this.contactGroupList[0];
    this.contactList = this.contactGroupList[0]['contacts'];
  }

  selectGroup(group): void {
    this.activeGroup = group;
    this.contactList = this.activeGroup['contacts'];
  }

  addContact(contact): void {
    const index = this.isSelected(contact);
    if (index !== false) {
      this.deviceStateService.selectedMessageReceivers.splice(index as number, 1);
    } else {
      this.deviceStateService.selectedMessageReceivers.push(contact);
    }
  }

  isSelected(contact): number | false {
    if (!this.deviceStateService.selectedMessageReceivers) {
      return false;
    }
    const index = this.deviceStateService.selectedMessageReceivers.indexOf(contact);
    if (index > -1) {
      return index;
    } else {
      return false;
    }
  }

  close(): void {
    this.show = false;
  }
}
