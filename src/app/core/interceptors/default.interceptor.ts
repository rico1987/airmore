import { Injectable, Injector, Inject } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponseBase } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { BrowserStorageService } from '../../shared/service/storage.service';
import { environment } from '../../../environments/environment';
import { UserInfo } from '../../shared/models/user-info.model';
import { CloudUserInfo } from '../../cloud/models/cloud-user-info.model';
import { AppConfig, APP_DEFAULT_CONFIG } from '../../config';


@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    constructor(
        @Inject(APP_DEFAULT_CONFIG) private appConfig: AppConfig,
        private browserStorageService: BrowserStorageService
    ) {}
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const url = req.url;
        const userInfo: UserInfo | any = this.browserStorageService.get(this.appConfig.app.accountStorageKey);
        const cloudUserInfo: CloudUserInfo | any = this.browserStorageService.get(this.appConfig.app.cloudStorageKey);
        let newReq;
        if (url.startsWith(environment.accountApiBaseUrl) && userInfo && userInfo.api_token) {
            newReq = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${userInfo.api_token}`
                }
            });
        } else if (url.startsWith(environment.cloudApiBaseUrl) && cloudUserInfo && cloudUserInfo.api_token) {
            newReq = req.clone({
                setHeaders: {
                    'Authorization': `Bearer ${cloudUserInfo.api_token}`
                }
            });
        } else {
            newReq = req.clone({url});
        }

        return next.handle(newReq).pipe(
            mergeMap((event: any) => {
                if (event instanceof HttpResponseBase) {
                    return this.handleData(event);
                } else {
                    return of(event);
                }
            }),
            catchError((err: HttpErrorResponse) => this.handleData(err)),
        );
    }


    private handleData(ev: HttpResponseBase): Observable<any> {
        return of(ev);
    }
}
