import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
import { SelectOption } from '../../../shared/components/dropdown-select-options/dropdown-select-options.component'
import { Contact } from '../../models/contact.model';

const PhoneTypes: Array<SelectOption> = [
  {
    key: 1,
    label: '家庭电话',
    value: 1,
  },
  {
    key: 2,
    label: '移动电话',
    value: 2,
  },
  {
    key: 3,
    label: '单位电话',
    value: 3,
  },
  {
    key: 4,
    label: '单位传真',
    value: 4,
  },
  {
    key: 5,
    label: '住宅传真',
    value: 5,
  },
  {
    key: 7,
    label: '其他电话',
    value: 7,
  },
];

const AddressTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'home',
    value: 1
  },
  {
    key: 2,
    label: 'work',
    value: 2
  },
  {
    key: 3,
    label: 'other',
    value: 3
  }
];

const EmailTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'home',
    value: 1
  },
  {
    key: 2,
    label: 'work',
    value: 2
  },
  {
    key: 3,
    label: 'other',
    value: 3
  },
  {
    key: 4,
    label: 'mobile',
    value: 4
  }
];

const ImTypes = [
  {
    key: 0,
    label: 'AIM',
    value: 0
  },
  {
    key: 1,
    label: 'MSN',
    value: 1
  },
  {
    key: 2,
    label: 'YaHoo',
    value: 2
  },
  {
    key: 3,
    label: 'Skype',
    value: 3
  },
  {
    key: 4,
    label: 'QQ',
    value: 4
  },
  {
    key: 5,
    label: 'Google Talk',
    value: 5
  },
  {
    key: 6,
    label: 'ICQ',
    value: 6
  },
  {
    key: 7,
    label: 'Jabber',
    value: 7
  },
  {
    key: 8,
    label: 'Net Meeting',
    value: 8
  },
];

const WebsiteTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'homepage',
    value: 1
  },
  {
    key: 2,
    label: 'blog',
    value: 2
  },
  {
    key: 3,
    label: 'account',
    value: 3
  },
  {
    key: 4,
    label: 'home',
    value: 4
  },
  {
    key: 5,
    label: 'work',
    value: 5
  },
  {
    key: 6,
    label: 'FTP',
    value: 6
  },
  {
    key: 7,
    label: 'other',
    value: 7
  },
];

const EventTypes = [
  {
    key: 0,
    label: 'custom',
    value: 0
  },
  {
    key: 1,
    label: 'anniversary',
    value: 1
  },
  {
    key: 2,
    label: 'other',
    value: 2
  },
  {
    key: 3,
    label: 'birthday',
    value: 3
  },
];

const ContactTemplate = {
  Name: {
      DisplayName: '',
  },
  Portrait: {
      Data: '',
  },
  GroupSelect: [],
  Organization: [{
    Company: '',
    Job: '',
  }],
  Phone: [],
  Address: [],
  Email: [],
  IM: [],
  Website: [],
  Event: [],
  Note: [{
    Content: '',
  }]
};

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: any;

  private groups: Array<any>;

  private isEdit: boolean = false;

  private phoneTypes: Array<any> = PhoneTypes;

  private addressTypes: Array<any> = AddressTypes;

  private emailTypes: Array<any> = EmailTypes;

  private imTypes: Array<any> = ImTypes;

  private websiteTypes: Array<any> = WebsiteTypes;

  private eventTypes: Array<any> = EventTypes;

  private editingContact: Contact;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
    this.groups = this.deviceStateService.tempContactsGroupList.concat();
  }


  edit(): void {
    if (this.isEdit) {
      this.save();
    } else {
      this.editingContact = ContactTemplate;
    }
    this.isEdit = !this.isEdit;
  }

  delete(): void {

  }

  save(): void {}

  cancel(): void {
    this.isEdit = false;
  }

  updatePortrait(): void {}

  deletePortrait(): void {}

  addItem(type: string): void {
    if (type === 'Address') {
      this.editingContact[type].push({
        Type: 1,
        Street: null,
      });
    } else if (type === 'Website') {
      this.editingContact[type].push({
        Type: 1,
        Url: null,
      });
    } else if (type === 'Event') {
      this.editingContact[type].push({
        Type: 1,
        StartDate: null,
      });
    } else {
      this.editingContact[type].push({
        Type: 1,
        Name: null,
      });
    }
  }

  onSelectGroupChange(selectedOptions: Array<any>): void {
    console.log(selectedOptions);
  }
}
