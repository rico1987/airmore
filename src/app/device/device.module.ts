import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DeviceRoutingModule } from './device-routing.module';
import { DeviceLayoutComponent } from './layout/device-layout/device-layout.component';
import { DeviceItemListComponent } from './components/device-item-list/device-item-list.component';
import { DeviceSidebarComponent } from './components/device-sidebar/device-sidebar.component';

@NgModule({
  declarations: [DeviceLayoutComponent, DeviceItemListComponent, DeviceSidebarComponent],
  imports: [
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    DeviceRoutingModule,
  ],
  providers: []
})
export class DeviceModule { }
