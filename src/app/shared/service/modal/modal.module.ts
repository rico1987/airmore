import { OverlayModule } from '@angular/cdk/overlay';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';

import { NzButtonModule } from 'ng-zorro-antd/button';
import { LoggerModule, NzNoAnimationModule } from 'ng-zorro-antd/core';
import { NzI18nModule } from 'ng-zorro-antd/i18n';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { CssUnitPipe } from './css-unit.pipe';

import { ModalControlService } from './modal-control.service';
import { ModalComponent } from './modal.component';
import { ModalService } from './modal.service';

@NgModule({
  imports: [CommonModule, OverlayModule, NzI18nModule, NzButtonModule, LoggerModule, NzIconModule, NzNoAnimationModule],
  exports: [ModalComponent],
  declarations: [ModalComponent, CssUnitPipe],
  entryComponents: [ModalComponent],
  providers: [ModalControlService, ModalService]
})
export class ModalModule {}
