import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { DeviceRoutingModule } from './device-routing.module';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    DeviceRoutingModule,
  ],
  providers: []
})
export class DeviceModule { }
