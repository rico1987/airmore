import { Component, OnInit, Input } from '@angular/core';

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

  @Input() default: Array<SelectOption>;

  open = true;

  constructor() { }

  ngOnInit() {
    if (this.default && this.selectedOptions.length === 0) {
      this.selectedOptions = this.default.concat();
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

  close(): void {
    this.open = false;
  }
}
