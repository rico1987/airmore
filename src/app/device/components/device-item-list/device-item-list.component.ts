import { Component, OnInit, Input, Inject, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { DeviceStateService } from '../../service/device-state.service';
import { NzTableComponent } from 'ng-zorro-antd';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-device-item-list',
  templateUrl: './device-item-list.component.html',
  styleUrls: ['./device-item-list.component.scss']
})
export class DeviceItemListComponent implements OnInit, AfterViewInit, OnDestroy {
  

  @ViewChild('itemListContainer') itemListContainer: ElementRef;

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;

  listOfData: any[] = [];


  private destroy$ = new Subject();

  // todo
  clipboardTextareaPlaceholder: string = 'Ctrl + Enter 保存到手机';
  clipboardValue: string = '';


  sortName: string | null = null;
  sortValue: string | null = null;
  pageSize: number;

  scrollHeight: number = 0;

  constructor(
    private deviceStateService: DeviceStateService,
  ) { }

  ngOnInit() {
    this.listOfData = this.deviceStateService.itemList;
  }

  ngAfterContentInit() {
    const containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    if (this.deviceStateService.activeFunction === 'musics') {
      this.scrollHeight = containerHeight - 111;
    } else {
      // todo
      this.scrollHeight = containerHeight - 80;
    }
  }

  checkAll(): void {
    this.deviceStateService.selectAll();
  }

  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }


  sort(sort: { key: string; value: string }): void {
  }

  play(item): void {

  }

  export(data): void {
    this.deviceStateService.download(data);
  }

  delete(data): void {
    this.deviceStateService.deleteItem(data);
  }


  onTdCheckedChange(event: any, item: any): void {
    if (event) {
      this.deviceStateService.addItems([item]);
    } else {
      this.deviceStateService.removeItems([item]);
    }
  }

  onPageIndexChange(number): void {
    // this.deviceStateService.currentPage = number;
    // this.deviceStateService.getItemList();
  }

  currentPageDataChange(): void {
  }

  cancelClipboardEdit(): void {
    this.deviceStateService.isClipboardEditing = false;
  }

  saveToClipboard(): void {
    this.deviceStateService.saveClipboard(this.clipboardValue);
  }

  get listOfDisplayData(): Array<any> {
    return this.deviceStateService.itemList;
  }

  get isAllDisplayDataChecked(): boolean {
    return this.deviceStateService.selectedItems.length > 0 && this.deviceStateService.selectedItems.length === this.deviceStateService.itemList.length;
  }

  get isClipboardEditing(): boolean {
    return this.deviceStateService.isClipboardEditing;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
  ngAfterViewInit(): void {
    // this.nzTableComponent.cdkVirtualScrollViewport.scrolledIndexChange
    //   .pipe(takeUntil(this.destroy$))
    //   .subscribe(data => {
    //     console.log('scroll index to', data);
    //   });
  }
}
