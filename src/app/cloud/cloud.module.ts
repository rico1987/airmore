import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CloudRoutingModule } from './cloud-routing.module';
import { SharedModule } from '../shared/shared.module';

import { CloudItemComponent } from './components/cloud-item/cloud-item.component';
import { CloudSidebarComponent } from './components/cloud-sidebar/cloud-sidebar.component';
import { CloudLayoutComponent } from './layout/cloud-layout/cloud-layout.component';
import { CloudItemListComponent } from './components/cloud-item-list/cloud-item-list.component';
import { CloudNoItemComponent } from './components/cloud-no-item/cloud-no-item.component';
import { CloudNavigatorComponent } from './components/cloud-navigator/cloud-navigator.component';


@NgModule({
  declarations: [
    CloudItemComponent,
    CloudSidebarComponent,
    CloudLayoutComponent,
    CloudItemListComponent,
    CloudNoItemComponent,
    CloudNavigatorComponent
  ],
  imports: [
    SharedModule,
    CommonModule,
    CloudRoutingModule,
  ],
  providers: [
  ]
})
export class CloudModule { }
