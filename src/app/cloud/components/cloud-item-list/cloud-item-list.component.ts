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

  // itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  // currentPage = 1;

  // itemsPerPage = 50;

  // parentsStack: Array<Node>;

  // loading = false;

  constructor(
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
    this.cloudStateService.getItemList();
  }

  refresh(): void {

  }
}
