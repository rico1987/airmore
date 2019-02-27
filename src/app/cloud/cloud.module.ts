import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ItemListComponent } from './components/item-list/item-list.component';
import { LayoutModule } from '../layout/layout.module';
import { CloudRoutingModule } from './cloud-routing.module';

// #region Http Interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { CloudInterceptor } from './interceptors/cloud.interceptor';
import { CloudItemComponent } from './components/cloud-item/cloud-item.component';
import { CloudSidebarComponent } from './components/cloud-sidebar/cloud-sidebar.component';
import { CloudLayoutComponent } from './layout/cloud-layout/cloud-layout.component';
const INTERCEPTOR_PROVIDES = [
  { provide: HTTP_INTERCEPTORS, useClass: CloudInterceptor, multi: true },
];
// #endregion


@NgModule({
  declarations: [ItemListComponent, CloudItemComponent, CloudSidebarComponent, CloudLayoutComponent],
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
