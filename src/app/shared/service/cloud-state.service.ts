import {
  Injectable,
  Inject,
  Injector,
  ApplicationRef,
  ComponentFactoryResolver,
  EmbeddedViewRef,
} from '@angular/core';
import { NzModalService } from 'ng-zorro-antd/modal';

import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';
import { Audio, Document, Label, Location, Node, OtherResource, People, Video } from '../../cloud/models';
import { NodeService } from './node.service';
import { CommonResponse } from '../../shared/models';
import { downloadLink } from '../../utils/tools';
import { MessageService } from './message.service';
import { CloudBaseService } from './cloud-base.service';

import { RenameModalComponent } from '../../shared/components/rename-modal/rename-modal.component';
import { NewFolderModalComponent } from '../../shared/components/new-folder-modal/new-folder-modal.component';
import { DynamicInputComponent } from '../../shared/components/dynamic-input/dynamic-input.component';
import { CopyModalComponent } from '../../shared/components/copy-modal/copy-modal.component';
import { InvitationModalComponent } from '../../shared/components/invitation-modal/invitation-modal.component';

import { UploadFile } from '../../shared/components/dynamic-input/interfaces';
import { ImageViewerComponent } from '../../shared/components/image-viewer/image-viewer.component';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'pictures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  activeImageCategory: 'labs' | 'places' | 'people' = 'labs';

  selectedItems: Array<any> = []; // 选中的item

  activeViewMode:  'list' | 'grid' = 'grid';

  private functions: Array<string>;

  itemList: Array<Audio | Document | Label | Location | Node | OtherResource | People | Video> = [];

  currentPage = 1;

  itemsPerPage: number = this.appConfig.app.cloudItemsPerPage;

  total: number = 0;

  parentsStack: Array<any> = [];

  uploadQueue: Array<UploadFile> = [];

  uploadedCount: number = 0;

  loading = false;

  interval = null;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private componentFactoryResolver: ComponentFactoryResolver,
    private injector: Injector,
    private cfr: ComponentFactoryResolver,
    private appRef: ApplicationRef,
    private nodeService: NodeService,
    private modalService: NzModalService,
    private messageService: MessageService,
    private cloudBaseService: CloudBaseService,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
    // todo 计算排列参数
  }

  /**
   * 预览图片
   */
  preview(item: any): void {
      const itemList = this.itemList.filter((ele: any) => ele.type === 'image');
      console.log(itemList);
      const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(ImageViewerComponent)
      .create(this.injector);

      this.appRef.attachView(componentRef.hostView);

      const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
        .rootNodes[0] as HTMLElement;

      componentRef.instance.imageList = itemList.concat();
      componentRef.instance.thumbKey = 'image_thumb_url';
      componentRef.instance.srcKey = 'image_url';
      componentRef.instance.onClose = () => {
        componentRef.destroy();
        document.body.removeChild(domElem);
      };
      
      document.body.appendChild(domElem);
  }

  /**
   * 获取item列表
   */
  getItemList(
    category?: 'image' | 'document' | 'video' | 'audio' | null,
    per_page?: number | null,
    page?: number | null,
    parent_id?: string | null,
    is_load_more: boolean = false,
  ): Promise<any> {

    return new Promise((resolve) => {
      if (!is_load_more) {
        this.itemList = [];
      }
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
            resolve();
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
            resolve();
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
              resolve();
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
                resolve();
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
                resolve();
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
                resolve();
              }
            );
          }
        }
      }
    });
  }

  /**
   * 处理请求列表返回的数据
   */
  processDataList(data: CommonResponse, is_load_more?: boolean): void {
    if (data.data.list) {
      if (this.activeViewMode === 'list') {
        this.itemList = this.itemList.concat(data.data.list);
      } else if (this.activeViewMode === 'grid') {
        let index = 0;
        this.interval = setInterval(() => {
          if (index < data.data.list.length) {
            this.itemList.push(data.data.list[index]);
            index += 1;
          }
          if (index === data.data.list.length - 1) {
            clearInterval(this.interval);
            this.interval = null;
          }
        }, 50);
      }
    }
    if (data.data.total) {
      this.total = data.data.total;
    }
  }

  /**
   * 下载item
   */
  download(item: any): void {
    if (item.node_type === 'folder' || item.people_id || item.user_lab_id || item.place_id) {
      this.messageService.error('不支持下载目录');
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
    if (this.selectedItems.length < this.itemList.length) {
      this.selectedItems = this.itemList.concat();
    } else {
      this.selectedItems = [];
    }
  }

  deleteItems(): void {
    if (this.selectedItems.length === 0) {
      this.messageService.error('请至少选择一个项目');
    }
    this.modalService.confirm({
      nzTitle: '<i>Warning</i>',
      nzContent: '<b>Do you Want to delete these items?</b>',
      nzOnOk: () => {
        this.loading = true;
        let node_list  = [];
        for (let i = 0, l = this.selectedItems.length; i < l; i++) {
          if (this.selectedItems[i].library_id) {
            node_list.push(this.selectedItems[i].library_id)
          } else if (this.selectedItems[i].resource_id) {
            node_list.push(this.selectedItems[i].resource_id)
          }
        }
        this.nodeService.deleteNodes(node_list)
          .subscribe(
            (data: CommonResponse) => {
              if(data.status === '1') {
                this.messageService.success('删除成功');
                this.refreshItemList();
              }
            },
            (error) => {
              if (error) {
                this.messageService.error('删除失败');
              }
            },
            () => {
              this.loading = false;
            }
          );
      }
    });
  }

  /**
   * 重命名文件或文件夹
   */
  rename(): void {
    const renameModal = this.modalService.create({
      nzTitle: '<i>Rename</i>',
      nzContent: RenameModalComponent,
      nzFooter: [
        {
          label: 'OK',
          onClick: componentInstance => {
            renameModal.close();
            const name = componentInstance.name;
            const item = this.selectedItems[0];
            if (!name) {
              return;
            }
            let postData;
            if (item.node_type === 'folder') {
              postData = {
								title: name,
							}
            } else {
              const filename = name + item.filename.substring(item.filename.lastIndexOf('.')).toLowerCase();
              postData = {
								filename: filename,
							}
            }
            const id = item.resource_id || item.node_id;
            this.nodeService.changeNode(item.node_type !== 'folder', id, postData)
              .subscribe(
                (data: CommonResponse) => {
                  if(data.status === '1') {
                    this.messageService.success('修改成功');
                    this.refreshItemList();
                  }
                },
                (error) => {
                  if (error) {
                    this.messageService.error('修改失败');
                  }
                },
                () => {
                  this.loading = false;
                }
              )
          }
        }
      ],
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {

      }
    });
  }

  /**
   * 拷贝或复制
   */
  copy(): void {
    const copyModal = this.modalService.create({
      nzTitle: '<i>Copy or Move</i>',
      nzContent: CopyModalComponent,
      nzFooter: [
        {
          label: 'Copy',
          onClick: componentInstance => {
            const id_list: Array<string> = [];
            const target_id = componentInstance.activedNode.key;
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
              id_list.push(this.selectedItems[i]['library_id'] || this.selectedItems[i]['resource_id']);
            }
            this.nodeService.moveNodes(id_list, target_id, 1)
              .subscribe(
                (data: CommonResponse) => {
                  console.log(data);
                  this.messageService.success('操作成功');
                },
                (error) => {
                  if (error) {
                    this.messageService.error('操作失败');
                  }
                },
                () => {
                  this.loading = false;
                }
              )
            copyModal.close();
          }
        },
        {
          label: 'Move',
          onClick: componentInstance => {
            const id_list: Array<string> = [];
            const target_id = componentInstance.activedNode.key;
            for (let i = 0, l = this.selectedItems.length; i < l; i++) {
              id_list.push(this.selectedItems[i]['library_id'] || this.selectedItems[i]['resource_id']);
            }
            this.nodeService.moveNodes(id_list, target_id, 0)
              .subscribe(
                (data: CommonResponse) => {
                  console.log(data);
                  this.messageService.success('操作成功');
                },
                (error) => {
                  if (error) {
                    this.messageService.error('操作失败');
                  }
                },
                () => {
                  this.loading = false;
                }
              )
            copyModal.close();
          }
        }
      ],
      nzMaskClosable: false,
      nzClosable: true,
      nzOnOk: () => {

      }
    });
  }

  /**
   * 上传文件
   */
  upload(): void {
    if (this.parentsStack.length === 0) {
      this.messageService.warning('Can\'t upload file in the root folder!');
      return;
    }
    const componentRef = this.componentFactoryResolver
      .resolveComponentFactory(DynamicInputComponent)
      .create(this.injector);

    componentRef.instance.options = {
      multiple: true,
    };
    
    this.appRef.attachView(componentRef.hostView);

    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0] as HTMLElement;
    
    document.body.appendChild(domElem);

    componentRef.instance.onFileChange = (fileList: UploadFile[]) => {
      this.uploadQueue = [];
      for(let i = 0, l = fileList.length; i < l; i++) {
        const uploadFile: UploadFile = (fileList[i] as UploadFile);
        uploadFile.progress = 0;
        uploadFile.status = 'uploading';
        this.uploadQueue.push(uploadFile);
      }
      console.log(this.uploadQueue);
      const library_id = this.parentsStack[this.parentsStack.length - 1].library_id;
      fileList.forEach((file: UploadFile) => {
        this.cloudBaseService
          .upload(file, library_id, this.onUploadProgress.bind(this))
          .then((res) => {
            if (res.data.status === '1') {
              this.uploadedCount ++ ;
              if (res.name) {
                const key = res.name;
                const index = this.uploadQueue.findIndex((ele) => ele.key === key);
                this.uploadQueue[index].progress = 1;
                this.uploadQueue[index].status = 'done';
              }
              if (this.uploadedCount === this.uploadQueue.length) {
                this.refreshItemList();
              }
            } else if (res.data.status === -203) {
              this.messageService.error('The storage space is full!');
            }
          });
      });
    };

    componentRef.instance.onClick();
  }

  export(): void {
    for (let i = 0, l = this.selectedItems.length; i < l; i++) {
      this.download(this.selectedItems[i]);
    }
  }

  onUploadProgress(progress: number, checkpoint: any, res?: any): void {
    if (checkpoint) {
      const key = checkpoint.key;
      console.log(progress);
      const index = this.uploadQueue.findIndex((ele) => ele.key === key);
      if (this.uploadQueue[index]) {
        this.uploadQueue[index].progress = progress;
      }
    }
  }

  /**
   * 创建新文件夹
   */
  newFolder(): void {
    const newFolderModal = this.modalService.create({
      nzTitle: '<i>New Folder</i>',
      nzContent: NewFolderModalComponent,
      nzFooter: [
        {
          label: 'OK',
          onClick: componentInstance => {
            newFolderModal.close();
            const name = componentInstance.name;
            if (!name) {
              return;
            }
            const postData = {
              title: name
            };

            const parentLength = this.parentsStack.length;
            const library_id = parentLength > 0 ? this.parentsStack[parentLength - 1].library_id : null;

            if (library_id) {
              postData['parent_id'] = library_id;
            }
            this.nodeService.addFolder(postData)
              .subscribe(
                (data: CommonResponse) => {
                  if(data.status === '1') {
                    this.messageService.success('添加成功');
                    this.refreshItemList();
                  }
                },
                (error) => {
                  if (error) {
                    this.messageService.error('添加失败');
                  }
                },
                () => {
                  this.loading = false;
                }
              )
          }
        }
      ],
      nzMaskClosable: false,
      nzClosable: false,
      nzOnOk: () => {

      }
    });
  }

  showInvitationModal(): void {
    const invitationModal = this.modalService.create({
      nzTitle: '<i>获取更大云空间</i>',
      nzContent: InvitationModalComponent,
      nzMaskClosable: false,
      nzFooter: null,
      nzClosable: true,
      nzOnOk: () => {

      }
    });
  }

  /**
   *
   */
  downloadItems(): void {
      if (this.selectedItems.length === 0) {
        return;
      }
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

  /**
   * 将items数组添加到已选择数组中
   */
  addItems(items: Array<any>): void {
    this.selectedItems.push(...items);
  }

  /**
   * 将items数组里的对象从已选择数组里移除
   */
  removeItems(items: Array<any>): void {
    for (let i = 0, length = items.length; i < length; i++) {
      const index = this.selectedItems.indexOf(items[i]);
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

  setActiveViewMode(activeViewMode:  'list' | 'grid'): void {
    this.activeViewMode = activeViewMode;
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
