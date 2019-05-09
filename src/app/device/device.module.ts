import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NzTableModule } from 'ng-zorro-antd/table';
import { FormsModule } from '@angular/forms';
import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';



import { SharedModule } from '../shared/shared.module';
import { DeviceRoutingModule } from './device-routing.module';
import { DeviceLayoutComponent } from './layout/device-layout/device-layout.component';
import { DeviceItemListComponent } from './components/device-item-list/device-item-list.component';
import { DeviceSidebarComponent } from './components/device-sidebar/device-sidebar.component';
import { DeviceItemComponent } from './components/device-item/device-item.component';
import { DeviceItemGroupComponent } from './components/device-item-group/device-item-group.component';

@NgModule({
  declarations: [DeviceLayoutComponent, DeviceItemListComponent, DeviceSidebarComponent, DeviceItemComponent, DeviceItemGroupComponent],
  imports: [
    CommonModule,
    SharedModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    DeviceRoutingModule,
    NzTableModule,
    FormsModule,
    NzTreeModule,
    NzIconModule,
  ],
  providers: []
})
export class DeviceModule { }
