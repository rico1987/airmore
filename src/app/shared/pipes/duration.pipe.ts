import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'duration'
})
export class DurationPipe implements PipeTransform {

  _addZero(num: number): string {
    if (num < 10) {
      return '0' + num;
    }
    return num + '';
  }

  transform(value: number, args?: any): any {
    let hours, minutes, seconds;
    seconds = Math.floor(value) % 60;
    minutes = Math.floor(value / 60) % 60;
    hours = Math.floor(value / 60 / 60);
    if (hours > 0) {
      return `${hours}:${this._addZero(minutes)}:${this._addZero(seconds)}`;
    } else {
      return `${this._addZero(minutes)}:${this._addZero(seconds)}`; 
    }
  }

}
