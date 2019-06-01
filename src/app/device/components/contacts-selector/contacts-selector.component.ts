import { Component, OnInit } from '@angular/core';
import { DeviceStateService, DeviceService } from '../../../shared/service';
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
  
  private tempContactsGroupList: Array<any>;

  private loading: boolean;

  constructor(
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
  ) { }

  ngOnInit() {
    if (this.deviceStateService.contactGroupList) {
      this.contactGroupList = this.deviceStateService.contactGroupList.concat();
      this.activeGroup = this.contactGroupList[0];
      this.contactList = this.contactGroupList[0]['contacts'];
    } else {
      this.contactGroupList = [];
      this.loading = true;
      this.deviceService.getContactGroupList()
        .subscribe((data) => {
          const ungroupedContacts = [];
          const hasNumberContacts = [];
          this.tempContactsGroupList = data;
          for (let i = 0, l = this.tempContactsGroupList.length; i < l; i++) {
            this.tempContactsGroupList[i]['key'] = this.tempContactsGroupList[i]['ID'];
            this.tempContactsGroupList[i]['label'] = this.tempContactsGroupList[i]['GroupName'];
            this.tempContactsGroupList[i]['value'] = this.tempContactsGroupList[i]['ID']
          }
          this.deviceService.getAllContacts()
            .subscribe((data) => {
              for (let i = 0, l = data.length; i < l; i++) {
                if (data[i]['Phone'] && data[i]['Phone'].length > 0) {
                  hasNumberContacts.push(data[i]);
                }
                if (!data[i]['Groups'] || data[i]['Groups'].length === 0) {
                  ungroupedContacts.push(data[i]);
                }
                for (let j = 0, l = this.tempContactsGroupList.length; j < l; j++) {
                  if (data[i]['Groups'] && data[i]['Groups'].length > 0) {
                    if (data[i]['Groups'].some(group => group['GroupRowId'] === this.tempContactsGroupList[j]['ID'])) {
                      if (this.tempContactsGroupList[j]['contacts']) {
                        this.tempContactsGroupList[j]['contacts'].push(data[i]);
                      } else {
                        this.tempContactsGroupList[j]['contacts'] = [data[i]];
                      }
                    }
                  }
                }
              }
              this.contactGroupList.push({
                ID: '0',
                GroupName: 'All Contacts',
                contacts: data,
              });
              this.contactGroupList.push({
                ID: '-1',
                GroupName: 'Contacts with number',
                contacts: hasNumberContacts,
              });
              this.contactGroupList.push({
                ID: '-2',
                GroupName: 'UngroupedContacts',
                contacts: ungroupedContacts,
              });
              this.contactGroupList.push(...this.tempContactsGroupList);
              this.loading =false;
              console.log(this.contactGroupList);
            });
        });
    }
    
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
