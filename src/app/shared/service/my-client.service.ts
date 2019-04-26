/**
 * HttpClient 的封装
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { BrowserStorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class MyClientService {

  constructor(
    private http: HttpClient,
    private browserStorageService: BrowserStorageService
  ) { }

  addInterceptor(): void {}

  /**
   * 注意：HttpParams.set()方法会返回一个新的HttpParams对象
   */
  get(module: string, url: string, params?: Object): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.get(this.processUrl(url, module), {
      params: httpParams,
    });
  }

  post(module: string, url: string, data?: Object, options?: Object): Observable<any> {
    return this.http.post(this.processUrl(url, module), data, options);
  }

  /**
   * 获取设备局域网ip后与设备之间的通信
   */
  devicePost(key: string, data?: Object, options?: Object): Observable<any> {
    const deviceInfo = this.browserStorageService.get('deviceInfo');
    return this.http.post(`http://${deviceInfo.PrivateIP}:${deviceInfo.Port}/?Key=${key}`, data, options);
  }

  put(module: string, url: string, data?: Object, options?: Object): Observable<any> {
    return this.http.put(this.processUrl(url, module), data, options);
  }

  delete(module: string, url: string, params?: Object): Observable<any> {
    let httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams = httpParams.set(key, params[key]);
      }
    }
    return this.http.delete(this.processUrl(url, module), {
      params: httpParams,
    });
  }

  processUrl(url?: string, module?: string): string {
    if (!url.startsWith('https://') && !url.startsWith('http://')) {
      if (module === 'cloud') {
        url = environment.cloudApiBaseUrl + url;
      } else if (module === 'account') {
        url = environment.accountApiBaseUrl + url;
      }
    }
    return url;
  }
}
