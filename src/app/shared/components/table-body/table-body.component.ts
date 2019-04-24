import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-table-body',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.scss']
})
export class TableBodyComponent implements OnInit {

  @Input()
  get rows(): Array<any> { return this._rows; };
  set rows(rows: Array<any>) { this._rows = rows; };
  private _rows: Array<any> = [];

  @Output() rowDoubleClick = new EventEmitter<any>();

  @Output() rowMouseEnter = new EventEmitter<any>();

  @Output() rowMouseLeave = new EventEmitter<any>();

  @Output() cellMouseEnter = new EventEmitter<any>();

  @Output() cellMouseLeave = new EventEmitter<any>();

  @Output() cellClick = new EventEmitter<any>();

  @Output() cellDoubleClick = new EventEmitter<any>();


  constructor() { }

  ngOnInit() {
  }

  handleRowClick(): void {}

  handleRowDoubleClick(): void {}

  handleRowMouseEnter(): void {}

  handleRowMouseLeave(): void {}

  handleCellMouseEnter(): void {}

  handleCellMouseLeave(): void {}

  handleCellClick(): void {}

  handleCellDoubleClick(): void {}
}
