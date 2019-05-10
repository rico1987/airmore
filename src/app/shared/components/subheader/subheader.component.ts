import { Component, OnInit } from '@angular/core';
import { CloudStateService } from '../../../cloud/service/cloud-state.service';
import { DeviceStateService } from '../../../device/service/device-state.service';
import { AppStateService } from '../../../shared/service/app-state.service';
import { MessageService } from '../../../shared/service/message.service';


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
    { class: 'add', action: 'copy-to-clipboard', text: 'Add' },
    { class: 'upload', action: 'import', text: 'Import Files' },
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

  constructor(
    private cloudStateService: CloudStateService,
    private deviceStateService: DeviceStateService,
    private appStateService: AppStateService,
    private messageService: MessageService,
  ) { }

  ngOnInit() {
  }

  doAction(action: string, isInactive: boolean): void {
    this.appStateService.doAction(action, isInactive);
  }

  hasAction(action: string): boolean {
    return this.appStateService.hasAction(action);
  }

  isInactive(action: string): boolean {
    return this.appStateService.isInactive(action);
  }

  get selectedCount(): number {
    if (this.appStateService.currentModule === 'device') {
      return this.deviceStateService.selectedItems.length;
    } else if (this.appStateService.currentModule === 'cloud') {
      return this.cloudStateService.selectedItems.length;
    }
  }
}
