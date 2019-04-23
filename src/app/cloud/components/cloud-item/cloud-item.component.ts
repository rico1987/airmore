import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';
import { CloudStateService } from '../../service/cloud-state.service';
import { getFileShortName } from '../../../utils';

@Component({
  selector: 'app-cloud-item',
  templateUrl: './cloud-item.component.html',
  styleUrls: ['./cloud-item.component.scss']
})
export class CloudItemComponent implements OnInit {

  @Input() 
  get item(): any { return this._item; }
  set item(item: any) { this._item = item; }
  private _item: any;

  // type: 'audio' | 'document' | 'label' | 'location' | 'node' | 'otherResource' | 'people' | 'video';

  constructor(
    private cloudStateService: CloudStateService,
  ) {
  }

  ngOnInit() {
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
    } else if (this.type === 'lab' || this.type === 'place' || this.type === 'people') {
      this.cloudStateService.resetPaging();
      this.cloudStateService.parentsStack.push(this.item);
      this.cloudStateService.getItemList();
    }
  }

  preview(): void  {
    event.stopPropagation();
    if (this.item.node_type === 'folder' || this.type === 'lab' || this.type === 'place' || this.type === 'people') {
        this.openResource();
    } else if (this.item.type === 'image') {
        this.cloudStateService.preview(this.item);
    }
  }

  download(): void {
    event.stopPropagation();
    this.cloudStateService.download(this.item);
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

  get type(): string {
    if (this.item && this.item.node_id && this.item.node_type === 'folder') {
      return 'folder';
    } else if (this.item && this.item.type === 'image') {
      return 'image';
    } else if (this.item && this.item.type === 'audio') {
      return 'audio';
    } else if (this.item && this.item.type === 'video') {
      return 'video';
    } else if (this.item && this.item.type === 'application') {
      return 'application';
    } else if (this.item && this.item.type === 'document') {
      return 'document';
    } else if (this.item && this.item.user_lab_id) {
      return 'lab';
    } else if (this.item && this.item.place_id) {
      return 'place';
    } else if (this.item && this.item.people_id) {
      return 'people';
    }
  }

  get shortName(): string {
    return getFileShortName(this.item.title || this.item.filename, 15);
  }
}
