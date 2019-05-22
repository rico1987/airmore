import { Component, OnInit, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../../config';
import { NzFormatEmitEvent, NzTreeNode } from 'ng-zorro-antd';
import { NodeService } from '../../service/node.service';
import { CommonResponse } from '../../models';

@Component({
  selector: 'app-copy-modal',
  templateUrl: './copy-modal.component.html',
  styleUrls: ['./copy-modal.component.scss']
})
export class CopyModalComponent implements OnInit {

  nodes: Array<any> = [];

  activedNode: NzTreeNode;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
    private nodeService: NodeService,
  ) {
    this.init();
  }

  init(): void {
    this.nodeService.getNodeList(1, 100)
      .subscribe(
        (data: CommonResponse) => {
          this.nodes = this.processData(data.data.list);
        },
        (error) => {
          if (error) {
          }
        },
        () => {
        }
      )
  }

  activeNode(event): void {
    if (!event.node.isLeaf) {
      this.activedNode = event.node;
    }
  }

  openFolder(data: NzTreeNode | Required<NzFormatEmitEvent>): void {
    if (data instanceof NzTreeNode) {
      data.isExpanded = !data.isExpanded;
    } else {
      const node = data.node;
      console.log(node);
      const library_id = node.origin.library_id;
      if (library_id && !node.isExpanded) {
        this.nodeService.getNodeList(1, this.appConfig.app.cloudItemsPerPage, library_id)
          .subscribe(
            (data: CommonResponse) => {
              node.isExpanded = true;
              node.addChildren(this.processData(data.data.list));
              console.log(node);
            },
            (error) => {
              if (error) {
              }
            },
            () => {
            }
          );
      } else if (library_id && node.isExpanded) {
        node.isExpanded = false;
      }
    }
  }

  processData(arr: Array<any>): Array<any> {
    for (let i = 0, l = arr.length; i < l; i++) {
      arr[i]['isExpanded'] = false;
      arr[i]['key'] = arr[i]['library_id'] || arr[i]['node_id'];
      arr[i]['title'] = arr[i]['title'] || arr[i]['filename'];
      arr[i]['isLeaf'] = arr[i]['node_type'] !== 'folder';
    }
    return arr;
  }

  ngOnInit() {
  }

}
