// 管理app全局状态
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {

  isAccountLogined = false; // 账号是否已登陆

  constructor() { }

  
}
