import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-grid-list',
  templateUrl: './grid-list.component.html',
  styleUrls: ['./grid-list.component.scss']
})
export class GridListComponent implements OnInit {

  @Input() listItems: Array<any>;

  @Input() loading: boolean = false;

  @Input() headerTemplate: Array<any>;

  @Input() rowTemplate: Array<any>;

  @Input() sortBy: string;


  constructor() { }

  ngOnInit() {
  }


  sort(): void {}

}
