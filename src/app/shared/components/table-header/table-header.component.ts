import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-header',
  templateUrl: './table-header.component.html',
  styleUrls: ['./table-header.component.scss']
})
export class TableHeaderComponent implements OnInit {

  @Input()
  get columns(): any { return this._columns; }
  set columns(columns: any) { this._columns = columns; }
  private _columns: any;

  @Output() sorted = new EventEmitter<any>();

  sort: 'ascending' | 'descending' = 'ascending';

  constructor() { }

  ngOnInit() {
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
