import { Component, OnInit } from '@angular/core';
import { NzFormatEmitEvent, NzTreeNodeOptions, NzTreeNode } from 'ng-zorro-antd';
const copy = require('clipboard-copy')
import { AppStateService } from '../../../shared/service/app-state.service';
import { DeviceStateService } from '../../service/device-state.service';
import { DeviceService } from '../../../shared/service/device.service';
import { BrowserStorageService } from '../../../shared/service/storage.service';
import { MessageService } from '../../../shared/service/message.service';


@Component({
  selector: 'app-device-sidebar',
  templateUrl: './device-sidebar.component.html',
  styleUrls: ['./device-sidebar.component.scss']
})
export class DeviceSidebarComponent implements OnInit {

  activedNode: NzTreeNode;

  constructor(
    private appStateService: AppStateService,
    private deviceService: DeviceService,
    private deviceStateService: DeviceStateService,
    private browserStorageService: BrowserStorageService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
    this.deviceStateService.getSidebarItemList();
  }

  getThumbPath(path: string, size: number): string {
    const thumbSize = size || 168;
    return `${this.deviceService.resolvePath(path)}?Shortcut=1&Width=${thumbSize}&Height=${thumbSize}`;
  }

  selectAlbum(item): void {
    this.deviceStateService.selectAlbum(item);
  }

  checkItem(item): void {
    if (this.deviceStateService.hasItem(item)) {
      this.deviceStateService.removeItems([item]);
    } else {
      this.deviceStateService.addItems([item]);
    }
  }

  setActive(item): void {
    this.deviceStateService.setActiveItem(item);
  }

  isSelected(item): boolean {
    return this.deviceStateService.hasItem(item);
  }

  isActive(item): boolean {
    return this.deviceStateService.activeItem && this.deviceStateService.activeItem['ID'] == item['ID'];
  }

  copyToClipboard(item, event: Event): void {
    event.stopPropagation();
    copy(item.Content);
    this.messageService.success('Copied to clipboard!');
  }

  removeSecondes(time: string): string {
    if (!time) {
      return '';
    }
    return time.substring(0, time.lastIndexOf(':'));
  }

  selectNode(node: NzTreeNode): void {
    this.activedNode = node;
    this.deviceStateService.activeNode = node;
    this.deviceService.getDirectoryFiles(node.origin.Path)
        .subscribe(
            (data) => {
              this.deviceStateService.setItemList(data);
            },
            (error) => {
              if (error) {
              }
            },
            () => {
            }
        );
  }

  activeNode(event): void {
    if (!event.node.isLeaf) {
      this.activedNode = event.node;
    }
  }

  openFolder(node: NzTreeNode, event: Event): void {
    node.isExpanded = !node.isExpanded;
    if (node instanceof NzTreeNode) {
      if (!node['touched']) {
        node['touched'] = true;
        const Path = node.origin.Path;
        if (node.isExpanded) {
          this.deviceService.getDirectoryFiles(Path)
          .subscribe(
              (data) => {
                node.addChildren(this.transferToNodes(data));
              },
              (error) => {
                if (error) {
                }
              },
              () => {
              }
          );
        }
      }
    }
    event.stopPropagation();
  }

  transferToNodes(arr: Array<any>): Array<any> {
    let tempArr: Array<any> = [];
    for (let i = 0, l = arr.length; i < l; i++) {
      arr[i]['isExpanded'] = false;
      arr[i]['key'] = arr[i]['Path'];
      arr[i]['title'] = arr[i]['ShowName'];
      arr[i]['isLeaf'] = arr[i]['FileType'] === 1;
      arr[i]['touched'] = false;
      if (arr[i]['FileType'] === 2) {
        tempArr.push(arr[i]);
      }
    }
    return tempArr;
  }
}
