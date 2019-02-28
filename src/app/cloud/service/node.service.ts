import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CloudModule } from '../cloud.module';

import { MyClientService } from '../../shared/service/my-client.service';

@Injectable({
  providedIn: 'root'
})
export class NodeService {

  constructor(
    private myClientService: MyClientService,
  ) { }

  /**
   * 获取节点列表
   * @param per_page 
   * @param parent_id 父节点ID
   * @param node_type 节点类型,文件或者文件夹
   * @param page 
   */
  getNodeList(page: number, per_page: number, parent_id?: string,  node_type?: 'folder' | 'file'): Observable < any > {
    const params = {
      page,
      per_page,
    };
    params['per_page'] = per_page;
    if (parent_id) {
      params['parent_id'] = parent_id;
    }
    if (node_type) {
      params['node_type'] = node_type;
    }
    return this.myClientService.get('cloud', '/nodes', params);
  }

  /**
   * 批量删除节点
   * @param id_list 节点ID列表
   */
  deleteNodes(id_list: [string]): Observable < any > {
    return this.myClientService.delete('cloud', '/nodes', {
      id_list: JSON.stringify(id_list),
    });
  }

  /**
   * 获取节点信息
   * @param id 节点ID
   */
  getNodeInfo(id: number): Observable < any > {
    return this.myClientService.get('cloud', `/nodes/${id}`);
  }

  /**
   * 拷贝节点
   * @param id_list 要移动的节点id列表
   * @param target_id 目标节点id
   * @param is_copy 是否复制，0 否 1 是
   */
  moveNodes(id_list: [string], target_id: string, is_copy: 0 | 1): Observable < any > {
    return this.myClientService.put('cloud', '/nodes', {
      id_list: JSON.stringify(id_list),
      target_id,
      is_copy,
    });
  }

  /**
   * 读取分类下的照片
   * @param category 分类
   * @param per_page 
   * @param page 
   */
  getCategoryFiles(category: 'image' | 'document' | 'video' | 'audio' | 'others', per_page: number, page: number): Observable < any > {
    return this.myClientService.get('cloud', `/type/${category}/files`, {
      per_page,
      page,
    });
  }
}
