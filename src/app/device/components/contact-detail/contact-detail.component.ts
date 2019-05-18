import { Component, OnInit, Input } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
import { SelectOption } from '../../../shared/components/dropdown-select-options/dropdown-select-options.component'

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

@Component({
  selector: 'app-contact-detail',
  templateUrl: './contact-detail.component.html',
  styleUrls: ['./contact-detail.component.scss']
})
export class ContactDetailComponent implements OnInit {

  @Input() contact: any;

  private groups: Array<any>;

  private isEdit: boolean = true;

  private phoneTypes: Array<any> = PhoneTypes;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
    this.groups = this.deviceStateService.tempContactsGroupList.concat();
  }


  edit(): void {
    if (this.isEdit) {
      this.save();
    }
    this.isEdit = !this.isEdit;
  }

  save(): void {}

  updatePortrait(): void {}

  deletePortrait(): void {}

  onSelectGroupChange(selectedOptions: Array<any>): void {
  }
}
