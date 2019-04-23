import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit {

  @Input()
  get data(): Array<any> { return this._data; };
  set data(data: Array<any>) { this._data = data; };
  private _data: Array<any> = [];

  @Input() private size: string;

  @Input() private 

  @Input() private showHeader: boolean = true;

  @Input() private defaultSort: string;

  constructor() { }

  ngOnInit() {
  }

  onSorted(data) {
    console.log(data);
  }

}
