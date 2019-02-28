import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../models';
import { NodeService } from './node.service';
import { CommonResponse } from '../../shared/models/common-response.model';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  selectedItems: Array<any> = []; // 选中的item

  private functions: Array<string>;

  itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  currentPage = 1;

  itemsPerPage = 50;

  parentsStack: Array<Node>;

  loading = false;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private nodeService: NodeService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
  }

  getItemList(
    category?: 'image' | 'document' | 'video' | 'audio' | null,
    per_page?: number | null,
    page?: number | null,
    parent_id?: string | null,
  ): void {
    this.loading = true;
    const activeFunction = this.activeFunction;
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

  setCloudActiveFunction(fun: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others'): void {
    this.activeFunction = fun;
  }

  addItems(items: Array<any>): void {
    this.selectedItems.push(...items);
  }

  removeItems(items: Array<any>): void {
    for (let i = 0, length = items.length; i < length; i++) {
      const index = this.selectedItems.indexOf(items[i])
      if (index > -1) {
        this.selectedItems.splice(index, 1);
      }
    }
  }

  hasItem(item: any): boolean {
    return this.selectedItems.indexOf(item) > -1;
  }

  getSelectedItems(): Array<any> {
    return this.selectedItems;
  }

  getCurrentParentId(): string {
    if (this.parentsStack && this.parentsStack.length > 0) {
      return this.parentsStack[this.parentsStack.length - 1].node_id;
    } else {
      return null;
    }
  }
}
