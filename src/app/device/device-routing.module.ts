import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const deviceRoutes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild(deviceRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DeviceRoutingModule { }