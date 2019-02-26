import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-subheader',
  templateUrl: './subheader.component.html',
  styleUrls: ['./subheader.component.scss']
})
export class SubheaderComponent implements OnInit {

  toolbarItems = [
    { class: 'new-folder', action: 'new-folder', text: 'New Folder' },
    { class: 'new-contact', action: 'new-contact', text: 'New Contact' },
    { class: 'new-message', action: 'new-message', text: 'New Message' },
    { class: 'copy-to-clipboard', action: 'copy-to-clipboard', text: 'Add' },
    // { class: 'upload', action: 'import', text: 'Import Files' },
    // { class: 'upload', action: 'upload', text: 'Upload' },
    // { class: 'copy', action: 'copy-or-move', text: 'Copy or Move' },
    // { class: 'download', action: 'download', text: 'Export' },
    // { class: 'install', action: 'install', text: 'Install' },
    // { class: 'backup', action: 'backup', text: 'Backup' },
    { class: 'refresh', action: 'refresh', text: 'Refresh' },
    { class: 'delete', action: 'delete', text: 'Delete' },
    { class: 'rename', action: 'rename', text: 'Rename' },
    { class: 'wallpaper', action: 'set-as-wallpaper', text: 'Set as Phone Wallpaper' },
    { class: 'select', action: 'select-all', text: 'Select All' },
  ];

  constructor() { }

  ngOnInit() {
  }

}
