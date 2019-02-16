import { NgModule } from '@angular/core';
import { LayoutDefaultComponent } from './default/default.component';
import { LayoutDesktopComponent } from './desktop/desktop.component';

const COMPONENTS = [
    LayoutDefaultComponent,
    LayoutDesktopComponent,
];

@NgModule({
    declarations: [...COMPONENTS],
    exports: [...COMPONENTS],
})
export class LayoutModule {}
