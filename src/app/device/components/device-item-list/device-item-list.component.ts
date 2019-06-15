import { ChangeDetectionStrategy, Component, OnInit, Input, Inject, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NzTableComponent } from 'ng-zorro-antd';
const copy = require('clipboard-copy')
import { MessageService, DeviceService } from '../../../shared/service';
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
  styleUrls: ['./device-item-list.component.scss'],
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

  containerScrollTop: number = null;

  containerHeight: number = null;


  sortKey: string | null = null;
  sortValue: string | null = null;
  pageSize: number;

  scrollHeight: number = 0;

  constructor(
    private messageService: MessageService,
    private deviceService: DeviceService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
    this.listOfData = this.deviceService.itemList;
    this.deviceService.contactDetailRef = this.contactDetail;
    
  }

  ngAfterContentInit() {
    this.containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    if (this.deviceService.activeFunction === 'musics') {
      this.scrollHeight = this.containerHeight - 150;
    } else {
      this.scrollHeight = this.containerHeight - 60;
    }

    window.onresize = () => {
      this.containerHeight = this.itemListContainer.nativeElement.offsetHeight;
    };
  }

  onScroll(event) {
    this.containerScrollTop = event.target.scrollTop;
  }
  

  call(): void {
    const Phone = this.deviceService.activeItem['Phone'];
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
    this.deviceService.setDeviceActiveFunction('contacts');
    this.deviceService.isAddingContact = true;
  }

  onContactKey(event): void {
    const value = event.target.value;
    
  }

  removeFormReceivers(contact): void {
    const index = this.deviceService.selectedMessageReceivers.indexOf(contact);
    if (index > -1) {
      this.deviceService.selectedMessageReceivers.splice(index, 1);
    }
  }

  selectAllContacts(): void {
    if (this.isAllSelected) {
      this.deviceService.selectedItems = [];
    } else {
      console.log(this.deviceService.contactLetterGroupList)
      for (let i = 0, l = this.deviceService.contactLetterGroupList.length; i < l; i++) {
        this.deviceService.addItems(this.deviceService.contactLetterGroupList[i]['contacts']);
      }
    }
  }

  checkAll(): void {
    this.deviceService.selectAll();
  }

  scrollToIndex(index: number): void {
    this.nzTableComponent.cdkVirtualScrollViewport.scrollToIndex(index);
  }

  setActive(item: any): void {
    this.deviceService.activeItem = item;
  }


  sort(sort: { key: string; value: string }): void {
    this.sortKey = sort['key'];
    this.sortValue = sort['value'];
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
    if (!this.deviceService.isAddingContact) {
      if (this.messageValue) {
        if (this.deviceService.selectedMessageReceivers.length > 0) {
          const postData = [];
          for (let i = 0, l = this.deviceService.selectedMessageReceivers.length; i < l; i++) {
            postData.push({
              Phone: isArray(this.deviceService.selectedMessageReceivers[i]['Phone']) ? this.deviceService.selectedMessageReceivers[i]['Phone'][0]['Name'] : '',
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
        this.deviceService.sendMessage(this.deviceService.activeItem['Phone'], this.messageValue)
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
    this.musicPlayer.setPlayList(this.deviceService.itemList);
    this.musicPlayer.setCurrentPlayingItem(item);
    this.musicPlayer.play();
  }

  export(data): void {
    this.deviceService.download(data);
  }

  delete(data): void {
    this.deviceService.deleteItem(data);
  }


  onTdCheckedChange(event: any, item: any): void {
    if (event) {
      this.deviceService.addItems([item]);
    } else {
      this.deviceService.removeItems([item]);
    }
  }

  selectItem(item: any): void {
    if(this.deviceService.hasItem(item)) {
      this.deviceService.removeItems([item]);
    } else {
      this.deviceService.addItems([item]);
    }
  }

  copyToClipboard(item, event: Event): void {
    event.stopPropagation();
    copy(item.Content);
    this.messageService.success('Copied to clipboard!');
  }

  onPageIndexChange(number): void {
    // this.deviceService.currentPage = number;
    // this.deviceService.getItemList();
  }

  currentPageDataChange(): void {
  }

  cancelClipboardEdit(): void {
    this.deviceService.clipboardValue = '';
    this.deviceService.isClipboardEditing = false;
  }

  scrollToLetter(letter: string): void {
    const element = this.contactGroupContainer.nativeElement.getElementsByClassName('letter-' + letter)[0];
    element && element.scrollIntoView();
  }

  saveToClipboard(): void {
    this.deviceService.saveClipboard();
  }

  openItem(item: any): void {
    // this.deviceService.activeNode = item;
    // this.deviceService.getDirectoryFiles(item.origin.Path)
    //     .subscribe(
    //         (data) => {
    //           this.deviceService.setItemList(data);
    //         },
    //         (error) => {
    //           if (error) {
    //           }
    //         },
    //         () => {
    //         }
    //     );
  }

  get isAllSelected(): boolean {
    return this.contactsCount > 0 && this.contactsCount === this.deviceService.selectedItems.length;  
  }

  get listOfDisplayData(): Array<any> {
    if (this.sortKey && this.sortValue) {
      return this.deviceService.itemList.concat().sort((a, b) => {
        let flag;
        if (a[this.sortKey] > b[this.sortKey]) {
          flag = 1;
        } else if (a[this.sortKey] < b[this.sortKey]) {
          flag = -1;
        } else {
          flag = 0;
        }
        if (this.sortValue === 'descend') {
          flag = -flag;
        }
        return flag;
      });
    } else {
      return this.deviceService.itemList;
    }    
  }

  get isAllDisplayDataChecked(): boolean {
    return this.deviceService.selectedItems.length > 0 && this.deviceService.selectedItems.length === this.deviceService.itemList.length;
  }

  get isClipboardEditing(): boolean {
    return this.deviceService.isClipboardEditing;
  }

  get contactsCount(): number {
    let count = 0;
    if (!this.deviceService.contactLetterGroupList) {
      return 0;
    }
    for (let i = 0, l = this.deviceService.contactLetterGroupList.length; i < l; i++) {
      count += this.deviceService.contactLetterGroupList[i]['contacts'].length;
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
