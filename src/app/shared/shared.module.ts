import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { OverlayModule } from '@angular/cdk/overlay';
import { NzInputModule } from 'ng-zorro-antd';
import { NzDropDownModule } from 'ng-zorro-antd';

import { ConnectionComponent } from './components/connection/connection.component';
import { AccountComponent } from './components/account/account.component';
import { PasswordLoginFormComponent } from './forms/password-login-form/password-login-form.component';
import { ResetPasswordFormComponent } from './forms/reset-password-form/reset-password-form.component';
import { PhonePasswordLessLoginFormComponent } from './forms/phone-password-less-login-form/phone-password-less-login-form.component';
import { EmailPasswordLessLoginFormComponent } from './forms/email-password-less-login-form/email-password-less-login-form.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';
import { SubheaderComponent } from './components/subheader/subheader.component';
import { DesktopComponent } from './components/desktop/desktop.component';
import { LazyLoadImageComponent } from './components/lazy-load-image/lazy-load-image.component';
import { GridListComponent } from './components/grid-list/grid-list.component';
import { TableComponent } from './components/table/table.component';
import { TableColumnComponent } from './components/table-column/table-column.component';
import { TableHeaderComponent } from './components/table-header/table-header.component';
import { TableBodyComponent } from './components/table-body/table-body.component';
import { RegisterFormComponent } from './forms/register-form/register-form.component';
import { MusicPlayerComponent } from './components/music-player/music-player.component';
import { RadarComponent } from './components/radar/radar.component';
import { MessageComponent } from './components/message/message.component';
import { MessageContainerComponent } from './components/message/message-container.component';

import { MESSAGE_DEFAULT_CONFIG_PROVIDER } from './components/message/message-config';
import { RenameModalComponent } from './components/rename-modal/rename-modal.component';
import { NewFolderModalComponent } from './components/new-folder-modal/new-folder-modal.component';
import { DynamicInputComponent } from './components/dynamic-input/dynamic-input.component';
import { ImageViewerComponent } from './components/image-viewer/image-viewer.component';
import { CopyModalComponent } from './components/copy-modal/copy-modal.component';

import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';

import { SizePipe } from './pipes/size.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { FileTypePipe } from './pipes/file-type.pipe';
import { TimePipe } from './pipes/time.pipe';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { IsFolderPipe } from './pipes/is-folder.pipe';

const COMPONENTS = [
  ConnectionComponent,
  AccountComponent,
  PasswordLoginFormComponent,
  ResetPasswordFormComponent,
  PhonePasswordLessLoginFormComponent,
  EmailPasswordLessLoginFormComponent,
  SidebarComponent,
  HeaderComponent,
  SubheaderComponent,
  LazyLoadImageComponent,
  TableComponent,
  MusicPlayerComponent,
];
const DIRECTIVES = [];

const PIPES = [
  SizePipe,
  DurationPipe,
  FileTypePipe,
  TimePipe,
  IsFolderPipe,
];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    DesktopComponent,
    GridListComponent,
    TableComponent,
    TableColumnComponent,
    TableHeaderComponent,
    TableBodyComponent,
    RegisterFormComponent,
    MusicPlayerComponent,
    RadarComponent,
    MessageComponent,
    MessageContainerComponent,
    SizePipe,
    DurationPipe,
    RenameModalComponent,
    NewFolderModalComponent,
    DynamicInputComponent,
    ImageViewerComponent,
    CopyModalComponent,
    DurationPipe,
    FileTypePipe,
    TimePipe,
    VideoPlayerComponent,
    IsFolderPipe,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    OverlayModule,
    NzInputModule,
    NzTreeModule,
    NzIconModule,
    NzDropDownModule,
  ],
  providers: [
    MESSAGE_DEFAULT_CONFIG_PROVIDER,
  ],
  exports: [
    RouterModule,
    TranslateModule,
    ...COMPONENTS,
    ...DIRECTIVES,
    ...PIPES,
  ],
  entryComponents: [
    MessageComponent,
    MessageContainerComponent,
    RenameModalComponent,
    NewFolderModalComponent,
    DynamicInputComponent,
    ImageViewerComponent,
    CopyModalComponent,
    VideoPlayerComponent,
  ],
})
export class SharedModule { }
