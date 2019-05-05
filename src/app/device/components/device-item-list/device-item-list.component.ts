import { Component, OnInit, Input, Inject, ViewChild, ElementRef } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';

@Component({
  selector: 'app-device-item-list',
  templateUrl: './device-item-list.component.html',
  styleUrls: ['./device-item-list.component.scss']
})
export class DeviceItemListComponent implements OnInit {

  @ViewChild('itemListContainer') itemListContainer: ElementRef;

  sortName: string | null = null;
  sortValue: string | null = null;
  pageSize: number;

  scrollHeight: number = 0;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
  }

  ngAfterContentInit() {
    const containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    this.scrollHeight = containerHeight - 111;
  }

  sort(sort: { key: string; value: string }): void {
    // this.sortName = sort.key;
    // this.sortValue = sort.value;
    // if (this.sortName && this.sortValue) {
    //   this.listOfDisplayData = this.deviceStateService.itemList.sort((a, b) =>
    //     this.sortValue === 'ascend'
    //       ? a[this.sortName!] > b[this.sortName!]
    //         ? 1
    //         : -1
    //       : b[this.sortName!] > a[this.sortName!]
    //       ? 1
    //       : -1
    //   );
    // } else {
    //   this.listOfDisplayData = this.deviceStateService.itemList;
    // }
  }

  play(item): void {

  }

  onPageIndexChange(number): void {
    // this.deviceStateService.currentPage = number;
    // this.deviceStateService.getItemList();
  }

  currentPageDataChange(): void {
  }

  get listOfDisplayData(): Array<any> {
    return this.deviceStateService.itemList;
  }

  get isAllDisplayDataChecked(): boolean {
    return this.deviceStateService.selectedItems.length > 0 && this.deviceStateService.selectedItems.length === this.deviceStateService.itemList.length;
  }

  get paginationTotal(): number {
    return 1;
    // return this.deviceStateService.total;
  }

  get paginationIndex(): number {
    return 1;
    // return this.deviceStateService.currentPage;
  }

  get paginationSize(): number {
    return 1;
    // return this.appConfig.app.cloudItemsPerPage;
  }
}
