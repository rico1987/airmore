import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LayoutDefaultComponent } from '../layout/default/default.component';
import { ItemListComponent } from './components/item-list/item-list.component';

const cloudRoutes: Routes = [
  {
    path: '',
    component: LayoutDefaultComponent,
    children: [
      { path: 'files', component: ItemListComponent },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forChild(cloudRoutes)
  ],
  exports: [
    RouterModule
  ]
})
export class CloudRoutingModule {}
