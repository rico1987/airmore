import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { ItemListComponent } from './components/item-list/item-list.component';

@NgModule({
  declarations: [ItemListComponent],
  imports: [
    BrowserModule,
    // import HttpClientModule after BrowserModule.
    HttpClientModule,
  ],
  providers: []
})
export class CloudModule { }
