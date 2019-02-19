import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Logger {

  constructor() { }

  log(msg: string): void {
    console.log(msg);
  }

  warn(msg: string): void {
    console.warn(msg);
  }

  error(msg: string): void {
    console.error(msg);
  }
}
