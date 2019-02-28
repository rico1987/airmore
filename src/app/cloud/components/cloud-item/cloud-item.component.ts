import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';

@Component({
  selector: 'app-cloud-item',
  templateUrl: './cloud-item.component.html',
  styleUrls: ['./cloud-item.component.scss']
})
export class CloudItemComponent implements OnInit {

  @Input() item: any;

  type: 'audio' | 'document' | 'label' | 'location' | 'node' | 'otherResource' | 'people' | 'video';

  constructor() {
    console.log(this.item);
  }

  ngOnInit() {
  }

  getType() {
    if (this.item.node_id && this.item.node_type) {
      return 'folder';
    }
  }

  getShortName(item) {
    return item.title;
  }

  selectItem(item) {
    console.log(item);
  }

}
