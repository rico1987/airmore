import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { CloudLayoutComponent } from './layout/cloud-layout/cloud-layout.component';
import { CloudItemListComponent } from './components/cloud-item-list/cloud-item-list.component';

const cloudRoutes: Routes = [
  {
    path: '',
    component: CloudLayoutComponent,
    children: [
      { path: 'clouds', component: CloudItemListComponent },
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
