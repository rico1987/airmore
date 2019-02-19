import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {

  constructor() { }

  log(msg: string): void {
    console.log(`%c ${msg}`, 'color: #000000;');
  }

  info(msg: string): void {
    console.log(`%c ${msg}`, 'color: #006400;');
  }

  warn(msg: string): void {
    console.log(`%c ${msg}`, 'color: #FFFF00;');
  }

  error(msg: string): void {
    console.log(`%c ${msg}`, 'color: #FF0000;');
  }
}
