import { Injectable, Inject } from '@angular/core';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';

@Injectable({
  providedIn: 'root'
})
export class CloudStateService {

  activeFunction: 'clouds' | 'picrures' | 'musics' | 'videos' | 'documents' | 'others' = 'clouds';

  selectedItems: Array<any> = []; // 选中的item

  private functions: Array<string>;

  constructor(
    @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
  ) {
    this.functions = this.appConfig.app.cloudFunctions;
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
}
