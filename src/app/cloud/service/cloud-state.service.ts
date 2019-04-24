import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../models';
import { NodeService } from './node.service';
import { CommonResponse } from '../../shared/models/common-response.model';
import { downloadLink } from '../../utils/tools';
import { ModalService } from '../../shared/service/modal.service';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  activeImageCategory: 'labs' | 'places' | 'people' = 'labs';

  selectedItems: Array<any> = []; // 选中的item

  private functions: Array<string>;

  itemList: [Audio | Document | Label | Location | Node | OtherResource | People | Video] | [];

  currentPage = 1;

  itemsPerPage: number = this.appConfig.app.cloudItemsPerPage;

  parentsStack: Array<any> = [];

  loading = false;

  interval = null;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private nodeService: NodeService,
    private modalService: ModalService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
    // todo 计算排列参数
  }

  /**
   * 预览图片
   * @param item 
   */
  preview(item: any): void {
      const itemList = this.itemList.filter((ele: any) => ele.type === 'image');
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
    clearInterval(this.interval);
    this.interval = null;
    this.loading = true;
    this.selectedItems = [];
    const activeFunction = this.activeFunction;
    if (activeFunction === 'clouds') {
      this.nodeService.getNodeList(
        page ? page : this.currentPage,
        per_page ? per_page : this.itemsPerPage,
        parent_id ? parent_id : this.currentParentId,
      )
      .subscribe(
        (data: CommonResponse) => {
          this.processDataList(data, is_load_more);
        },
        (error) => {
          if (error) {
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
      this.nodeService.getCategoryFiles(
        this.activeFunction,
        page ? page : this.currentPage,
        per_page ? per_page : this.itemsPerPage,
      )
      .subscribe(
        (data: CommonResponse) => {
          this.processDataList(data, is_load_more);
        },
        (error) => {
          if (error) {
          }
        },
        () => {
          this.loading = false;
        }
      );
    } else if (this.activeFunction === 'pictures') {
      if (!this.currentParentId) {
        this.nodeService.getCategoryImageList(
          this.activeImageCategory,
          page ? page : this.currentPage,
          per_page ? per_page : this.itemsPerPage,
        )
        .subscribe(
          (data: CommonResponse) => {
            this.processDataList(data, is_load_more);
          },
          (error) => {
            if (error) {
            }
          },
          () => {
            this.loading = false;
          }
        );
      } else {
        if (this.activeImageCategory === 'labs') {
          this.nodeService.getLabImageList(
            this.currentParentId,
            page ? page : this.currentPage,
            per_page ? per_page : this.itemsPerPage,
          )
          .subscribe(
            (data: CommonResponse) => {
              this.processDataList(data, is_load_more);
            },
            (error) => {
              if (error) {
              }
            },
            () => {
              this.loading = false;
            }
          );
        } else if (this.activeImageCategory === 'places') {
          this.nodeService.getPlaceImageList(
            this.currentParentId,
            page ? page : this.currentPage,
            per_page ? per_page : this.itemsPerPage,
          )
          .subscribe(
            (data: CommonResponse) => {
              this.processDataList(data, is_load_more);
            },
            (error) => {
              if (error) {
              }
            },
            () => {
              this.loading = false;
            }
          );
        } else if (this.activeImageCategory === 'people') {
          this.nodeService.getPeopleImageList(
            this.currentParentId,
            page ? page : this.currentPage,
            per_page ? per_page : this.itemsPerPage,
          )
          .subscribe(
            (data: CommonResponse) => {
              this.processDataList(data, is_load_more);
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
  }

  /**
   * 处理请求列表返回的数据
   * @param data 
   * @param is_load_more 
   */
  processDataList(data: CommonResponse, is_load_more?: boolean): void {
    if (data.data.list) {
      console.log(data.data.list);
      if (!is_load_more) {
        this.itemList = [];
      }
      let index = 0;
      this.interval = setInterval(() => {
        if (index < data.data.list.length) {
          this.itemList[index] = data.data.list[index];
          index += 1;
        }
        if (index === data.data.list.length - 1) {
          clearInterval(this.interval);
          this.interval = null;
        }
      }, 50);
    }
  }

  /**
   * 下载item
   * @param item 
   */
  download(item: any): void {
    if (item.node_type === 'folder' || item.people_id || item.user_lab_id || item.place_id) {
      // 暂不支持下载目录
    } else {
      const fileName = item.filename;
      const url = item.image_url || item.video_url || item.audio_url || item.url;
      if (url) {
        downloadLink(url, fileName);
      }
    }
  }

  /**
   * 选择全部
   */
  selectAll(): void {
    this.selectedItems = this.itemList.concat();
  }

  /**
   * 创建新文件夹
   */
  newFolder(): void {
    this.modalService.warn('test', 'test');
  }

  /**
   * 
   */
  downloadItems(): void {
      if (this.selectedItems.length === 0) {
        return;
      }
      console.log(this.selectedItems);
      for (let i = 0; i < this.selectedItems.length; i++) {
        this.download(this.selectedItems[i]);
      }
  }

  /**
   * 刷新列表
   */
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

  setActiveImageCategory(imageCategory: 'labs' | 'places' | 'people'): void {
    this.activeImageCategory = imageCategory;
    this.resetPaging();
    this.getItemList();
  }

  get currentParentId(): string {
    if (this.parentsStack && this.parentsStack.length > 0) {
      return this.parentsStack[this.parentsStack.length - 1].node_id ||
            this.parentsStack[this.parentsStack.length - 1].user_lab_id ||
            this.parentsStack[this.parentsStack.length - 1].people_id ||
            this.parentsStack[this.parentsStack.length - 1].place_id;
    } else {
      return null;
    }
  }
}
