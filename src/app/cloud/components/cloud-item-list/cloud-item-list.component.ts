import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../models';
import { CloudStateService, NodeService } from '../../service';
import { CommonResponse } from '../../../shared/models/common-response.model';

@Component({
  selector: 'app-cloud-item-list',
  templateUrl: './cloud-item-list.component.html',
  styleUrls: ['./cloud-item-list.component.scss']
})
export class CloudItemListComponent implements OnInit {

  @ViewChild('itemListContainer') itemListContainer: ElementRef;

  sortName: string | null = null;
  sortValue: string | null = null;
  pageSize: number;

  selectedItem: any;
  
  cloudHeaderTitles: Array<string> = ['Name', 'Type', 'Size', 'Modify time']; // todo

  cloudColumnKeys: Array<string | Array<string>> = ['title', 'type', 'size', 'updated_at'];

  cloudDefaultSort: string = 'title';

  listOfDisplayData: Array<any>;

  loading: boolean = false;

  scrollHeight: number = 0;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private cloudStateService: CloudStateService,
  ) { }

  ngOnInit() {
    this.cloudStateService.getItemList()
      .then(() => {
        this.listOfDisplayData = this.cloudStateService.itemList ? this.cloudStateService.itemList.concat() : [];
        console.log(this.listOfDisplayData);
      });
  }

  ngAfterContentInit() {
    const containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    this.scrollHeight = containerHeight - 150;
  }

  refresh(): void {
  }

  checkAll(): void {
    this.cloudStateService.selectAll();
  }

  onTdCheckedChange(event: any, item: any): void {
    if (event) {
      this.cloudStateService.addItems([item]);
    } else {
      this.cloudStateService.removeItems([item]);
    }
  }

  isChecked(item: any): boolean {
    return this.cloudStateService.hasItem(item); 
  }

  sort(sort: { key: string; value: string }): void {
    this.sortName = sort.key;
    this.sortValue = sort.value;
    if (this.sortName && this.sortValue) {
      this.listOfDisplayData = this.cloudStateService.itemList.sort((a, b) =>
        this.sortValue === 'ascend'
          ? a[this.sortName!] > b[this.sortName!]
            ? 1
            : -1
          : b[this.sortName!] > a[this.sortName!]
          ? 1
          : -1
      );
    } else {
      this.listOfDisplayData = this.cloudStateService.itemList;
    }
  }

  onPageIndexChange(number): void {
    this.cloudStateService.currentPage = number;
    this.cloudStateService.getItemList();
  }

  currentPageDataChange(): void {
  }

  preview(item): void {
    this.selectedItem = item;
    event.stopPropagation();
    if (this.selectedItem.node_type === 'folder' || this.type === 'lab' || this.type === 'place' || this.type === 'people') {
        this.openResource();
    } else if (this.selectedItem.type === 'image') {
        this.cloudStateService.preview(this.selectedItem);
    }
  }

  /**
   * 打开可打开的资源
   */
  openResource(): void {
    event.stopPropagation();
    if (this.selectedItem.node_type === 'folder') {
      this.cloudStateService.resetPaging();
      this.cloudStateService.parentsStack.push(this.selectedItem);
      this.cloudStateService.getItemList();
    } else if (this.selectedItem.node_type === 'file') {

    } else if (this.selectedItem.type === 'image') {
      this.preview(this.selectedItem);
    } else if (this.type === 'lab' || this.type === 'place' || this.type === 'people') {
      this.cloudStateService.resetPaging();
      this.cloudStateService.parentsStack.push(this.selectedItem);
      this.cloudStateService.getItemList();
    }
  }


  get type(): string {
    if (this.selectedItem && this.selectedItem.node_id && this.selectedItem.node_type === 'folder') {
      return 'folder';
    } else if (this.selectedItem && this.selectedItem.type === 'image') {
      return 'image';
    } else if (this.selectedItem && this.selectedItem.type === 'audio') {
      return 'audio';
    } else if (this.selectedItem && this.selectedItem.type === 'video') {
      return 'video';
    } else if (this.selectedItem && this.selectedItem.type === 'application') {
      return 'application';
    } else if (this.selectedItem && this.selectedItem.type === 'document') {
      return 'document';
    } else if (this.selectedItem && this.selectedItem.user_lab_id) {
      return 'lab';
    } else if (this.selectedItem && this.selectedItem.place_id) {
      return 'place';
    } else if (this.selectedItem && this.selectedItem.people_id) {
      return 'people';
    }
    return null;
  }

  get isAllDisplayDataChecked(): boolean {
    return this.cloudStateService.selectedItems.length > 0 && this.cloudStateService.selectedItems.length === this.cloudStateService.itemList.length;
  }

  get paginationTotal(): number {
    return this.cloudStateService.total;
  }

  get paginationIndex(): number {
    return this.cloudStateService.currentPage;
  }

  get paginationSize(): number {
    return this.appConfig.app.cloudItemsPerPage;
  }
}
