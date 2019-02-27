import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';

@Component({
  selector: 'app-cloud-item-list',
  templateUrl: './cloud-item-list.component.html',
  styleUrls: ['./cloud-item-list.component.scss']
})
export class CloudItemListComponent implements OnInit {

  @Input() itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  constructor() { }

  ngOnInit() {
  }

}
