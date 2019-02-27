import { Injectable, Injector } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent, HttpResponseBase } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { mergeMap, catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';


@Injectable()
export class DefaultInterceptor implements HttpInterceptor {
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger;
        let url = req.url;
        if (!url.startsWith('https://') && !url.startsWith('http://')) {
            url = environment.accountApiBaseUrl + url;
        }

        const newReq = req.clone({ url });
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
