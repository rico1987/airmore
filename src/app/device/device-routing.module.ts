import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';

const deviceRoutes: Routes = [
  { path: 'aaa',  component: ItemListComponent },
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
