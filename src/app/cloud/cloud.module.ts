import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ItemListComponent } from './components/item-list/item-list.component';
import { LayoutModule } from '../layout/layout.module';
import { CloudRoutingModule } from './cloud-routing.module';

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CloudInterceptor } from './interceptors/cloud.interceptor';
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: CloudInterceptor, multi: true },
];
// #endregion


@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    LayoutModule,
    CloudRoutingModule,
  ],
  providers: [
    ...INTERCEPTOR_PROVIDES,
  ]
})
export class CloudModule { }
