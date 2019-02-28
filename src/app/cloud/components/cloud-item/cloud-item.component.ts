import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';
import { CloudStateService } from '../../service/cloud-state.service';

@Component({
  selector: 'app-cloud-item',
  templateUrl: './cloud-item.component.html',
  styleUrls: ['./cloud-item.component.scss']
})
export class CloudItemComponent implements OnInit {

  @Input() item: any;

  type: 'audio' | 'document' | 'label' | 'location' | 'node' | 'otherResource' | 'people' | 'video';

  constructor(
    private cloudStateService: CloudStateService,
  ) {
    console.log(this.item);
  }

  ngOnInit() {
  }

  getType() {
    if (this.item.node_id && this.item.node_type) {
      return 'folder';
    }
  }

  getShortName() {
    return this.item.title;
  }

  selectItem(): void {
    this.cloudStateService.addItems([this.item]);
  }

  get isSelected(): boolean {
    return this.cloudStateService.hasItem(this.item);
  }

}
