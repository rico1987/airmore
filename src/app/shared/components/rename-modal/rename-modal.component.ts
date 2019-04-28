import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-rename-modal',
  templateUrl: './rename-modal.component.html',
  styleUrls: ['./rename-modal.component.scss']
})
export class RenameModalComponent implements OnInit {

  name: string; 
  
  constructor() { }

  ngOnInit() {
  }

}
