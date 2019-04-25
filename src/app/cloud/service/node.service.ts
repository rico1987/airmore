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
   * @param parent_id 父节点ID
   * @param node_type 节点类型,文件或者文件夹
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
   * 读取分类下的文件
   * @param category 分类
   */
  getCategoryFiles(category: 'pictures' | 'musics' | 'videos' | 'documents' | 'others',
  page: number, per_page: number): Observable < any > {
    // 项目使用的category和api接口使用的category不一样，所以需要转换一下
    let corresponding;
    if (category === 'pictures') {
      corresponding = '';
    }
    switch (category) {
      case 'pictures':
      corresponding = 'image';
      break;
      case 'musics':
      corresponding = 'audio';
      break;
      case 'videos':
      corresponding = 'video';
      break;
      case 'documents':
      corresponding = 'document';
      break;
      case 'others':
      corresponding = 'others';
      break;
    }
    return this.myClientService.get('cloud', `/type/${corresponding}/files`, {
      page,
      per_page,
    });
  }


  /**
   * 获取相应分类下的第一级列表
   */
  getCategoryImageList(category: 'labs' | 'places' | 'people', page: number, per_page: number): Observable < any > {
    return this.myClientService.get('cloud', `/${category}`, {
      page,
      per_page,
    });
  }

  /**
   * 获取标签下图片列表
   */
  getLabImageList(lab_id: string, page: number, per_page: number) {
    return this.myClientService.get('cloud', `/labs/${lab_id}/files`, {
      page,
      per_page,
    });
  }

  /**
   * 获取地址下图片列表
   */
  getPlaceImageList(place_id: string, page: number, per_page: number) {
    return this.myClientService.get('cloud', `/places/${place_id}/files`, {
      page,
      per_page,
    });
  }

  /**
   * 获取人物下图片列表
   */
  getPeopleImageList(people_id: string, page: number, per_page: number) {
    return this.myClientService.get('cloud', `/people/${people_id}/files`, {
      page,
      per_page,
    });
  }

}



