import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  _addZero(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num + '';
  }

  transform(value: any, args?: any): any {
    const time = new Date(value);
    return time.getFullYear() + '-' + this._addZero(time.getMonth()) + '-' + this._addZero(time.getDate()) +
           ' ' + this._addZero(time.getHours()) + ':' + this._addZero(time.getMinutes());
  }

}
