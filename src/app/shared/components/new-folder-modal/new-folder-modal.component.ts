import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-new-folder-modal',
  templateUrl: './new-folder-modal.component.html',
  styleUrls: ['./new-folder-modal.component.scss']
})
export class NewFolderModalComponent implements OnInit {

  name: string;

  constructor() { }

  ngOnInit() {
  }

}
