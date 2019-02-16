import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ConnectionComponent } from './components/connection/connection.component';

const COMPONENTS = [ConnectionComponent];
const DIRECTIVES = [];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
  imports: [
    RouterModule,
  ],
  providers: [
  ],
  exports: [
    RouterModule,
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule { }
