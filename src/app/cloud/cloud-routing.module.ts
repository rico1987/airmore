import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ItemListComponent } from './components/item-list/item-list.component';

const cloudRoutes: Routes = [
  { path: 'files',  component: ItemListComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(cloudRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CloudRoutingModule { }