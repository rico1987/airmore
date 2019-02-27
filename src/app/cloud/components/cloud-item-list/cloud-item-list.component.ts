import { Component, OnInit, Input } from '@angular/core';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';
import { AppStateService } from '../../../shared/service/app-state.service';

@Component({
  selector: 'app-cloud-item-list',
  templateUrl: './cloud-item-list.component.html',
  styleUrls: ['./cloud-item-list.component.scss']
})
export class CloudItemListComponent implements OnInit {

  itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  currentPage: number;

  constructor(
    private appStateService: AppStateService,
  ) { }

  ngOnInit() {
    this.getItemList();
  }

  getItemList(): void {

  }
}
