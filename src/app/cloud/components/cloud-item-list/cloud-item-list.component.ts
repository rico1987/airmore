import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';
import { CloudStateService, NodeService } from '../../service';
import { CommonResponse } from '../../../shared/models/common-response.model';

@Component({
  selector: 'app-cloud-item-list',
  templateUrl: './cloud-item-list.component.html',
  styleUrls: ['./cloud-item-list.component.scss']
})
export class CloudItemListComponent implements OnInit {

  itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  currentPage = 1;

  itemsPerPage = 50;

  parentsStack: Array<Node>;

  loading = false;

  constructor(
    private nodeService: NodeService,
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
    this.getItemList();
  }

  getItemList(
    category?: 'image' | 'document' | 'video' | 'audio' | null,
    per_page?: number | null,
    page?: number | null,
    parent_id?: string | null,
  ): void {
    this.loading = true;
    const activeFunction = this.cloudStateService.activeFunction;
    if (activeFunction === 'clouds') {
      this.nodeService.getNodeList(
        page ? page : this.currentPage,
        per_page ? per_page : this.itemsPerPage,
        parent_id ? parent_id : this.getCurrentParentId(),
      )
      .subscribe(
        (data: CommonResponse) => {
          if (data.data.list) {
            this.itemList = data.data.list;
            console.log(this.itemList);
          }
        },
        (error) => {
          if (error) {
            debugger
          }
        },
        () => {
          this.loading = false;
        }
      );
    }
  }

  refresh(): void {

  }

  getCurrentParentId(): string {
    if (this.parentsStack && this.parentsStack.length > 0) {
      return this.parentsStack[this.parentsStack.length - 1].node_id;
    } else {
      return null;
    }
  }
}
