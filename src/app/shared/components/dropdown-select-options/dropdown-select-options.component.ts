import { Component, OnInit, Input } from '@angular/core';
import { isArray } from '../../../utils/is'; 

export interface SelectOption {
  key: string | number;
  label: string;
  value: any;
};

@Component({
  selector: 'app-dropdown-select-options',
  templateUrl: './dropdown-select-options.component.html',
  styleUrls: ['./dropdown-select-options.component.scss']
})
export class DropdownSelectOptionsComponent implements OnInit {

  @Input() options: Array<SelectOption>;

  @Input() multiple: boolean;

  @Input() minWidth: number = 150;

  @Input() onValueChange: any;

  @Input() selectedOptions: Array<SelectOption> = [];

  @Input() showIcon: boolean = true;

  @Input() default: Array<string | number> | string | number;

  show = true;

  constructor() { }

  ngOnInit() {
    if (this.default && this.selectedOptions.length === 0) {
      for (let i = 0, l = this.options.length; i < l; i++) {
        if (this.checkInDefault(this.options[i]['key'])) {
          this.selectedOptions.push(this.options[i]);
        }
      }
    }
  }

  isSelected(option: SelectOption): boolean {
    const index = this.selectedOptions.findIndex((ele) => ele['key'] === option['key']);
    return index > -1;
  }

  deselect(option: SelectOption): void {
    const index = this.selectedOptions.findIndex((ele) => ele['key'] === option['key']);
    if (index > -1) {
      this.selectedOptions.splice(index, 1);
    }
  }

  onClickOption(option: SelectOption): void {
    if (this.isSelected(option)) {
      this.deselect(option);
    } else {
      if (this.multiple) {
        this.selectedOptions.push(option);
      } else {
        this.selectedOptions = [option];
      }
    }
    this.onValueChange(this.selectedOptions);
    this.close();
  }

  checkInDefault(toCheckValue: number | string): boolean {
    if (isArray(this.default)) {
      return (this.default as Array<string | number>).some((ele) => ele === toCheckValue);
    } else {
      return this.default === toCheckValue;
    }
  }

  close(): void {
    this.show = false;
  }
}
