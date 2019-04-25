import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()
  get data(): Array<any> { return this._data; }
  set data(data: Array<any>) { this._data = data; }
  private _data: Array<any> = [];

  @Input() private size: string;

  @Input() private _columnKeys: Array<string> = [];

  @Input() private showHeader = true;

  @Input() private defaultSort: string;

  constructor() { }

  ngOnInit() {
    console.log(this.data);
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
