import { Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
const copy = require('clipboard-copy')
import { MessageService, DeviceService } from '../../../shared/service';
import { DeviceStateService } from '../../../shared/service';
import { Subject } from 'rxjs';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { MusicPlayerComponent } from '../../../shared/components/music-player/music-player.component';
import { ContactDetailComponent } from '../contact-detail/contact-detail.component';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { ContactsSelectorComponent } from '../contacts-selector/contacts-selector.component';
import { ComponentPortal } from '@angular/cdk/portal';
import { isArray } from '../../../utils/is';

@Component({
  selector: 'app-device-item-list',
  templateUrl: './device-item-list.component.html',
  styleUrls: ['./device-item-list.component.scss']
})
export class DeviceItemListComponent implements OnInit, OnDestroy {
  

  @ViewChild('itemListContainer') itemListContainer: ElementRef;

  @ViewChild('virtualTable') nzTableComponent: NzTableComponent;

  @ViewChild('musicPlayer') musicPlayer: MusicPlayerComponent;

  @ViewChild('contactGroupContainer') contactGroupContainer: ElementRef;

  @ViewChild('messageContent') messageContent: ElementRef;

  @ViewChild('contactDetail') contactDetail: ElementRef<ContactDetailComponent>;

  @ViewChild('addContactBtn') addContactBtn: ElementRef;

  listOfData: any[] = [];

  allLetters: Array<string> = '#ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');


  private destroy$ = new Subject();

  private _overlayRef: OverlayRef | null;

  // todo
  clipboardTextareaPlaceholder: string = 'Ctrl + Enter 保存到手机';
  clipboardValue: string = '';

  messageTextareaPlaceholder: string = 'Ctrl + Enter 发送';
  messageValue: string = '';

  messageReceivers: Array<any> = [
    
  ];


  sortName: string | null = null;
  sortValue: string | null = null;
  pageSize: number;

  scrollHeight: number = 0;

  constructor(
    private messageService: MessageService,
    private deviceStateService: DeviceStateService,
    private deviceService: DeviceService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.listOfData = this.deviceStateService.itemList;
    this.deviceStateService.contactDetailRef = this.contactDetail;
  }

  ngAfterContentInit() {
    const containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    if (this.deviceStateService.activeFunction === 'musics') {
      this.scrollHeight = containerHeight - 150;
    } else {
      this.scrollHeight = containerHeight - 60;
    }
  }

  call(): void {
    const Phone = this.deviceStateService.activeItem['Phone'];
    if (Phone) {
      this.deviceService.call(Phone)
        .subscribe((res) => {
          if (res) {
            this.messageService.info('请在手机上完成拨打电话步骤.');
          } else {
            this.messageService.error('呼叫失败！');
          }
        })
    }
  }

  showContactSelector($event: MouseEvent): void {
    this.dispose();
    this._overlayRef = this.overlay.create(
      new OverlayConfig({
        scrollStrategy: this.overlay.scrollStrategies.close(),
        positionStrategy: this.overlay
          .position()
          .flexibleConnectedTo(this.addContactBtn)
          .withPositions([{
            originX: 'start',
            originY: 'bottom',
            overlayX: 'start',
            overlayY: 'top',
            offsetX: 0,
            offsetY: 0
          }])
      })
    );
    const instance = this._overlayRef.attach(new ComponentPortal(ContactsSelectorComponent)).instance;
    
    fromEvent<MouseEvent>(document, 'click')
      .pipe(
        filter(event => !!this._overlayRef && !this._overlayRef.overlayElement.contains(event.target as HTMLElement) && event.target !== $event.target),
        take(1)
      )
      .subscribe(() => instance.close());
    event.stopPropagation();
  }

  dispose(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  onMessageContentKeyDown(): void {

  }

  checkContact(): void {

  }

  addToContact(): void {

  }

  onContactKey(event): void {
    const value = event.target.value;
    
  }

  removeFormReceivers(contact): void {
    const index = this.deviceStateService.selectedMessageReceivers.indexOf(contact);
    if (index > -1) {
      this.deviceStateService.selectedMessageReceivers.splice(index, 1);
    }
  }

  selectAllContacts(): void {
    if (this.isAllSelected) {
      this.deviceStateService.selectedItems = [];
    } else {
      console.log(this.deviceStateService.contactLetterGroupList)
      for (let i = 0, l = this.deviceStateService.contactLetterGroupList.length; i < l; i++) {
        this.deviceStateService.addItems(this.deviceStateService.contactLetterGroupList[i]['contacts']);
      }
    }
  }

  checkAll(): void {
    this.deviceStateService.selectAll();
  }

  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  setActive(item: any): void {
    this.deviceStateService.activeItem = item;
  }


  sort(sort: { key: string; value: string }): void {
  }

  play(item): void {

  }

  onKeyDown(event: KeyboardEvent): boolean {
    if (event.keyCode == 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey)) {
      this.saveToClipboard();
      event.stopPropagation();
      return false;
    }
    return true;
  }

  sendMessage(): void {
    if (!this.deviceStateService.isAddingContact) {
      if (this.messageValue) {
        if (this.deviceStateService.selectedMessageReceivers.length > 0) {
          const postData = [];
          for (let i = 0, l = this.deviceStateService.selectedMessageReceivers.length; i < l; i++) {
            postData.push({
              Phone: isArray(this.deviceStateService.selectedMessageReceivers[i]['Phone']) ? this.deviceStateService.selectedMessageReceivers[i]['Phone'][0]['Name'] : '',
              Content: this.messageValue,
            })
          }
          console.log(postData);
          this.deviceService.sendMessages(postData)
            .subscribe((res) => {
              if (res === 0) {
                this.messageService.error('如果这是您第一次通过爱莫助手发送短信，请在手机上授权。');
              } else {
                this.messageService.success('发送成功。');
              }
            });
        }
      }
    } else {
      if (this.messageValue) {
        this.messageContent.nativeElement.scrollTop = this.messageContent.nativeElement.scrollHeight;
        this.messageValue = '';
        this.deviceService.sendMessage(this.deviceStateService.activeItem['Phone'], this.messageValue)
          .subscribe((res) => {
            if (res === 0) {
              this.messageService.error('发送失败！');
            } else {
              this.messageService.success('发送成功。');
            }
          });
      }
    }
  }

  playMusic(item): void {
    this.musicPlayer.setPlayList(this.deviceStateService.itemList);
    this.musicPlayer.setCurrentPlayingItem(item);
    this.musicPlayer.play();
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

  copyToClipboard(item, event: Event): void {
    event.stopPropagation();
    copy(item.Content);
    this.messageService.success('Copied to clipboard!');
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

  scrollToLetter(letter: string): void {
    const element = this.contactGroupContainer.nativeElement.getElementsByClassName('letter-' + letter)[0];
    element && element.scrollIntoView();
  }

  saveToClipboard(): void {
    this.deviceStateService.saveClipboard(this.clipboardValue);
  }

  get isAllSelected(): boolean {
    return this.contactsCount > 0 && this.contactsCount === this.deviceStateService.selectedItems.length;  
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

  get contactsCount(): number {
    let count = 0;
    for (let i = 0, l = this.deviceStateService.contactLetterGroupList.length; i < l; i++) {
      count += this.deviceStateService.contactLetterGroupList[i]['contacts'].length;
    }
    return count;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  getFileType(path: string): string {
    if (!path) {
      return '-';
    }
    const index = path.lastIndexOf('.');
    return path.substring(index + 1);
  }
}
