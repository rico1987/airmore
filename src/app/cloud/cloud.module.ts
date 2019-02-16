import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';

import { ItemListComponent } from './components/item-list/item-list.component';

import { CloudRoutingModule } from './cloud-routing.module';

@NgModule({
  declarations: [ItemListComponent],
  imports: [
    CommonModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
    CloudRoutingModule,
  ],
  providers: []
})
export class CloudModule { }
