import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-table-body',
  templateUrl: './table-body.component.html',
  styleUrls: ['./table-body.component.scss']
})
export class TableBodyComponent implements OnInit {

  private _table;

  constructor() { }

  ngOnInit() {
  }

  handleDoubleClick(): void {}

  handleMouseEnter(): void {}

  handleMouseLeave(): void {}

  handleCellMouseEnter(): void {}

  handleCellMouseLeave(): void {
  }
}
