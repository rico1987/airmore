import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType'
})
export class FileTypePipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value) {
      return '-';
    }
    const index = value.lastIndexOf('.');
    return value.substring(index + 1);
  }

}
