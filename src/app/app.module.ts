import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NZ_MODAL_CONFIG } from 'ng-zorro-antd';

// modules
import { SharedModule } from './shared/shared.module';
import { LayoutModule } from './layout/layout.module';
import { AppRoutingModule } from './app-routing.module';

// components
import { AppComponent } from './app.component';
import { PageNotFoundComponent } from './shared/components/page-not-found/page-not-found.component';

import { APP_DEFAULT_CONFIG_PROVIDER } from './config';

// AoT requires an exported function for factories
export function HttpLoaderFactory(httpClient: HttpClient) {
  return new TranslateHttpLoader(httpClient);
}

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { DefaultInterceptor } from './core/interceptors/default.interceptor';
import { TimeoutInterceptor, DEFAULT_TIMEOUT_PROVIDER } from './core/interceptors/timeout.interceptor';

const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: DefaultInterceptor, multi: true },
  [{ provide: HTTP_INTERCEPTORS, useClass: TimeoutInterceptor, multi: true }],
];
// #endregion

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    NzModalModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
    HttpClientModule,
    FormsModule,
    SharedModule,
    LayoutModule,
    AppRoutingModule,
  ],
  providers: [
    ...INTERCEPTOR_PROVIDES,
    APP_DEFAULT_CONFIG_PROVIDER,
    DEFAULT_TIMEOUT_PROVIDER,
    { provide: NZ_MODAL_CONFIG, useValue: { nzMask: true }}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
