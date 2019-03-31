import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DeviceItemListComponent } from './components/device-item-list/device-item-list.component';
import { DeviceLayoutComponent } from './layout/device-layout/device-layout.component';

const deviceRoutes: Routes = [
  {
    path: '',
    component: DeviceLayoutComponent,
    children: [
      { path: '', redirectTo: 'device', pathMatch: 'full'},
      { path: 'device', component: DeviceItemListComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(deviceRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class DeviceRoutingModule {}
