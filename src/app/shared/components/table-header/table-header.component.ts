import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  @Input() headerTitles: Array<string>;

  @Input() selectable: boolean;

  @Input() defaultSort: string;

  @Input() columnKeys: Array<string>;

  @Output() sorted = new EventEmitter<any>();

  columns: Array<any> = [];

  sort: 'ascending' | 'descending' = 'ascending';

  constructor() { }

  ngOnInit() {
    this._generateColumnsData();
  }

  private _generateColumnsData() {
    for (let i = 0, l = this.headerTitles.length; i < l; i++) {
      this.columns.push({
        id: this.columnKeys[i],
        label: this.headerTitles[i],
        sortable: true,
      })
    }
  }

  handleHeaderClick(event: any, column: any): void {
    console.log(event.target);
    console.log(column);
    this.sorted.emit({
      column,
      sort: this.sort,
    });
  }

  handleSort(event: any, column: any): void {
    console.log(event.target);
    this.sorted.emit({
      column,
      sort: this.sort,
    });
  }
}
