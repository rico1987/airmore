import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { DeviceRoutingModule } from './device-routing.module';
import { ItemListComponent } from './components/item-list/item-list.component';

@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    DeviceRoutingModule,
  ],
  providers: []
})
export class DeviceModule { }
