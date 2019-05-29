import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-contact-group-modal',
  templateUrl: './new-contact-group-modal.component.html',
  styleUrls: ['./new-contact-group-modal.component.scss']
})
export class NewContactGroupModalComponent implements OnInit {

  name: string;

  constructor() { }

  ngOnInit() {
  }

}
