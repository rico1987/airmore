import { Component, OnInit, ElementRef } from '@angular/core';
import { CloudStateService, DeviceService } from '../../service';
import { AppService } from '../../../shared/service/app.service';
import { MessageService } from '../../../shared/service/message.service';
import { SubheaderDropdownComponent } from '../subheader-dropdown/subheader-dropdown.component';
import { OverlayRef, Overlay, OverlayConfig } from '@angular/cdk/overlay';
import { fromEvent } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import { ComponentPortal } from '@angular/cdk/portal';



@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {

  toolbarItems = [
    { class: 'add-folder', action: 'new-folder', text: 'New Folder' },
    { class: 'add-contact', action: 'new-contact', text: 'New Contact' },
    { class: 'add-message', action: 'new-message', text: 'New Message' },
    { class: 'add-clipboard', action: 'copy-to-clipboard', text: 'Add' },
    { class: 'import', action: 'import', text: 'Import Files' },
    { class: 'import-contact', action: 'import-contact', text: 'Import' },
    { class: 'upload', action: 'upload', text: 'Upload' },
    { class: 'download', action: 'export', text: 'Export' },
    { class: 'copy', action: 'copy-or-move', text: 'Copy or Move' },
    { class: 'download', action: 'download', text: 'Download' },
    { class: 'install', action: 'install', text: 'Install' },
    { class: 'backup', action: 'backup', text: 'Backup' },
    { class: 'refresh', action: 'refresh', text: 'Refresh' },
    { class: 'delete', action: 'delete', text: 'Delete' },
    { class: 'rename', action: 'rename', text: 'Rename' },
    { class: 'wallpaper', action: 'set-as-wallpaper', text: 'Set as Wallpaper' },
    { class: 'select', action: 'select-all', text: 'Select All' },
  ];

  private _overlayRef: OverlayRef | null;

  constructor(
    private cloudStateService: CloudStateService,
    private deviceService: DeviceService,
    private appService: AppService,
    private overlay: Overlay,
  ) { }

  ngOnInit() {
  }

  doAction(action: string, isInactive: boolean, $event: any): void {
    if (action === 'import') {

      let target;
      if ($event.target.classList.contains('toolbar-icon')) {
        target = $event.target.parentNode;
      } else {
        target = $event.target;
      }
      const targetRef = new ElementRef(target);
      this.dispose();
      this._overlayRef = this.overlay.create(
        new OverlayConfig({
          scrollStrategy: this.overlay.scrollStrategies.close(),
          positionStrategy: this.overlay
            .position()
            .flexibleConnectedTo(targetRef)
            .withPositions([{
              originX: 'start',
              originY: 'bottom',
              overlayX: 'start',
              overlayY: 'top',
              offsetX: 0,
              offsetY: 10
            }])
        })
      );
      const instance = this._overlayRef.attach(new ComponentPortal(SubheaderDropdownComponent)).instance;
      
      fromEvent<MouseEvent>(document, 'click')
        .pipe(
          filter(event => !!this._overlayRef && !this._overlayRef.overlayElement.contains(event.target as HTMLElement) && event.target !== $event.target),
          take(1)
        )
        .subscribe(() => instance.close());
    } else {
      this.appService.doAction(action, isInactive);
    }
  }

  dispose(): void {
    if (this._overlayRef) {
      this._overlayRef.dispose();
      this._overlayRef = null;
    }
  }

  onSearchChange(): void {
    if (this.appService.searchKey) {
      this.appService.filter();
    } else {
      this.appService.clearFilter();
    }
  }

  clearSearchKey():void {
    this.appService.clearFilter();
  }

  hasAction(action: string): boolean {
    return this.appService.hasAction(action);
  }

  isInactive(action: string): boolean {
    return this.appService.isInactive(action);
  }

  get selectedCount(): number {
    if (this.appService.currentModule === 'device') {
      return this.deviceService.selectedItems.length;
    } else if (this.appService.currentModule === 'cloud') {
      return this.cloudStateService.selectedItems.length;
    }
  }
}
