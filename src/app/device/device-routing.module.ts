import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';
import { LayoutDesktopComponent } from '../layout/desktop/desktop.component';

const deviceRoutes: Routes = [
  {
    path: '',
    component: LayoutDesktopComponent,
    children: [
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
