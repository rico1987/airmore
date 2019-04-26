import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input() tableData: Array<any>;

  @Input() size: string;

  @Input() headerTitles: Array<string>;

  @Input() widthArray: Array<string>;

  @Input() columnKeys: Array<string> = [];

  @Input() selectable: boolean;

  @Input() showHeader = true;

  @Input() defaultSort: string;

  constructor() {
  }

  ngOnInit() {
    this.processData();
  }

  /**
   * 对传进来的数据进行一次处理
   */
  processData(): void {

  }

  onRowDoubleClick() {}

  onRowMouseEnter() {}

  onRowMouseLeave() {}

  onCellMouseEnter() {}

  onCellMouseLeave() {}

  onCellClick() {}

  onCellDoubleClick() {}



  onSorted(data) {
    console.log(data);
  }

}
