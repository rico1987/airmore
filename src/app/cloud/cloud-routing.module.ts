import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CloudLayoutComponent } from './layout/cloud-layout/cloud-layout.component';
import { ItemListComponent } from './components/item-list/item-list.component';

const cloudRoutes: Routes = [
  {
    path: '',
    component: CloudLayoutComponent,
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
