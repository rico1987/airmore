import { NgModule } from '@angular/core';
import { SharedModule } from '../shared';

import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { LayoutDefaultComponent } from './default/default.component';
import { LayoutDesktopComponent } from './desktop/desktop.component';

const COMPONENTS = [
    LayoutDefaultComponent,
    LayoutDesktopComponent,
];

@NgModule({
    imports: [SharedModule, NzToolTipModule],
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class LayoutModule {}
