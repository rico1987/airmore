import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'isRoot'
})
export class IsRootPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value === 1) {
      return '是';
    } else {
      return '否';
    }
  }
}
