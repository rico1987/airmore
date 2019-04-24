import { Component, OnInit } from '@angular/core';
import { CloudStateService } from '../../../cloud/service/cloud-state.service';
import { AppStateService } from '../../../shared/service/app-state.service';

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
    { class: 'copy', action: 'copy-or-move', text: 'Copy or Move' },
    { class: 'download', action: 'download', text: 'Download' },
    { class: 'install', action: 'install', text: 'Install' },
    { class: 'backup', action: 'backup', text: 'Backup' },
    { class: 'refresh', action: 'refresh', text: 'Refresh' },
    { class: 'delete', action: 'delete', text: 'Delete' },
    { class: 'rename', action: 'rename', text: 'Rename' },
    { class: 'wallpaper', action: 'set-as-wallpaper', text: 'Set as Phone Wallpaper' },
    { class: 'select', action: 'select-all', text: 'Select All' },
  ];

  constructor(
    private cloudStateService: CloudStateService,
    private appStateService: AppStateService,
  ) { }

  ngOnInit() {
  }

  doAction(action: string): void {
    switch (action) {
      case 'refresh':
        if (this.appStateService.currentModule === 'cloud') {
          this.cloudStateService.refreshItemList();
        }
        break;
      case 'new-folder':
        this.cloudStateService.newFolder();
        break;
      case 'download':
        if (this.appStateService.currentModule === 'cloud') {
          this.cloudStateService.downloadItems();
        }
        break;
      case 'select-all':
        if (this.appStateService.currentModule === 'cloud') {
          this.cloudStateService.selectAll();
        } else (this.appStateService.currentModule === 'device') {

        }
        break;

    }
  }

  hasAction(action: string): boolean {
    return this.appStateService.hasAction(action);
  }

  isInactive(action: string): boolean {
    return this.appStateService.isInactive(action);
  }
}
