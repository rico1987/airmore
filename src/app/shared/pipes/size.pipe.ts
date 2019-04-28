import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'size'
})
export class SizePipe implements PipeTransform {

  transform(value: any, args?: any): string {
    if (value > 1024 * 1024 * 1024) {
      return (value / 1024 / 1024 / 1024).toFixed(2) + 'GB'
    } else if (value > 1024 * 1024) {
      return (value / 1024 /1024).toFixed(2) + 'MB'
    } else if (value > 1024) {
      return (value / 1024).toFixed(2) + 'KB'
    } else if (value > 0) {
      return value + 'B'
    }
    return '-';
  }
}