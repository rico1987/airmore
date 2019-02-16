import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutDesktopComponent } from './desktop/desktop.component';

const COMPONENTS = [
    LayoutDefaultComponent,
    LayoutDesktopComponent,
];

@NgModule({
    imports: [SharedModule],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class LayoutModule {}
