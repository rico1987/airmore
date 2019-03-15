import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ItemListComponent } from './components/item-list/item-list.component';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceLayoutComponent } from './layout/device-layout/device-layout.component';

@NgModule({
  declarations: [ItemListComponent, DeviceLayoutComponent],
  imports: [
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    DeviceRoutingModule,
  ],
  providers: []
})
export class DeviceModule { }
