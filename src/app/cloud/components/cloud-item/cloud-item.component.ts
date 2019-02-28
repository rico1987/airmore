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

  checkItem(): void {
    if (this.isSelected) {
      this.cloudStateService.removeItems([this.item]);
    } else {
      this.cloudStateService.addItems([this.item]);
    }
  }

  /**
   * 打开可打开的资源
   */
  openResource(): void {
    event.stopPropagation();
    if (this.item.node_type === 'folder') {
      // this.cloudStateService.
      this.cloudStateService.resetPaging();
      this.cloudStateService.parentsStack.push(this.item);
      this.cloudStateService.getItemList();
    } else if (this.item.node_type === 'file') {

    } else if (this.item.type === 'image') {
      this.preview();
    }
  }

  preview(): void  {
    event.stopPropagation();
  }

  download(): void {
    event.stopPropagation();
  }

  delete(): void {
    event.stopPropagation();
  }

  supportOperation(operation: 'preview' | 'download' | 'delete'): boolean {
    return true;
  }

  get isSelected(): boolean {
    return this.cloudStateService.hasItem(this.item);
  }

}
