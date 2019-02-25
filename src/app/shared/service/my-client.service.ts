/**
 * HttpClient 的封装
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MyClientService {

  private baseUrl: string;

  constructor(private http: HttpClient) { }

  setBaseUrl(baseUrl: string): void {
    this.baseUrl = baseUrl;
  }

  addInterceptor(): void {}

  get(url: string, params?: Object): Observable<any> {
    const httpParams = new HttpParams();
    if (params) {
      for (const key of Object.keys(params)) {
        httpParams.set(key, params[key]);
      }
    }

    return this.http.get(this.baseUrl + url, {
      params: httpParams,
    });
  }

  post(url: string, data?: Object, options?: Object): Observable<any> {
    return this.http.post(this.baseUrl + url, data, options);
  }

  put(url: string, data?: Object, options?: Object): Observable<any> {
    return this.http.put(this.baseUrl + url, data, options);
  }

  delete(url: string, options?: Object): Observable<any> {
    return this.http.delete(this.baseUrl + url, options);
  }
}
