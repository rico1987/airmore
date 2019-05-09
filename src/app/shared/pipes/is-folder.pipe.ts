import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isFolder'
})
export class IsFolderPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 2) {
      return 'Folder';
    } else {
      return 'File';
    };
  }

}
