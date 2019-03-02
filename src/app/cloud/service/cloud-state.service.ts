import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../models';
import { NodeService } from './node.service';
import { CommonResponse } from '../../shared/models/common-response.model';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  selectedItems: Array<any> = []; // 选中的item

  private functions: Array<string>;

  itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video];

  currentPage = 1;

  itemsPerPage: number = this.appConfig.app.cloudItemsPerPage;

  parentsStack: Array<any> = [];

  loading = false;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private nodeService: NodeService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
    // todo 计算排列参数
  }

  /**
   * 获取item列表
   * @param category 
   * @param per_page 
   * @param page 
   * @param parent_id 
   */
  getItemList(
    category?: 'image' | 'document' | 'video' | 'audio' | null,
    per_page?: number | null,
    page?: number | null,
    parent_id?: string | null,
    is_load_more?: boolean,
  ): void {
    this.loading = true;
    const activeFunction = this.activeFunction;
    if (activeFunction === 'clouds') {
      this.nodeService.getNodeList(
        page ? page : this.currentPage,
        per_page ? per_page : this.itemsPerPage,
        parent_id ? parent_id : this.currentParentId,
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
    } else if (
      this.activeFunction === 'musics' ||
      this.activeFunction === 'videos' ||
      this.activeFunction === 'documents' ||
      this.activeFunction === 'others'
    ) {
      if (parent_id) {

      } else {
        this.nodeService.getCategoryFiles(
          this.activeFunction,
          page ? page : this.currentPage,
          per_page ? per_page : this.itemsPerPage,
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
            }
          },
          () => {
            this.loading = false;
          }
        );
      }
    }
  }

  refreshItemList(): void {
    this.resetPaging();
    this.getItemList();
  }

  /**
   * cloud navigator 组件返回上级目录函数
   */
  moveUp(): void {
    if (this.parentsStack.length > 0) {
      this.parentsStack.pop();
      this.getItemList();
    }
  }

  /**
   * cloud navigator 组件切换上级目录函数
   * @param parent 切换目标目录
   */
  changeParent(parent: any): void {
    const index = this.parentsStack.findIndex((ele) => ele.library_id === parent.library_id);
    if (index > -1) {
      this.parentsStack.splice(index + 1, this.parentsStack.length - index - 1);
    }
    this.resetPaging();
    this.getItemList();
  }

  setCloudActiveFunction(fun: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others'): void {
    if (fun !== this.activeFunction) {
      this.resetPaging();
      this.activeFunction = fun;
      this.getItemList();
    } else {
      this.activeFunction = fun;
    }
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

  resetPaging(): void {
    this.currentPage = 1;
    this.itemsPerPage = 50;
  }

  get currentParentId(): string {
    if (this.parentsStack && this.parentsStack.length > 0) {
      return this.parentsStack[this.parentsStack.length - 1].node_id;
    } else {
      return null;
    }
  }
}
