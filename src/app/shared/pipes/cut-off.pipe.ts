import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cutOff'
})
export class CutOffPipe implements PipeTransform {

  transform(value: string, args?: any): any {
    if (!value) {
        return '-'
    } else if (value.length < 20) {
        return value;
    } else {
        return value.substr(0,20) + '...';
    }
  }
}
