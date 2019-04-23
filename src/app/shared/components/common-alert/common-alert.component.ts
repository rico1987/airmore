import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-common-alert',
  templateUrl: './common-alert.component.html',
  styleUrls: ['./common-alert.component.scss']
})
export class CommonAlertComponent implements OnInit {
  
  @Input() title: string;
  
  @Input() Content: string;

  constructor() { }

  ngOnInit() {
  }

}
