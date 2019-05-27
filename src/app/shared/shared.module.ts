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
import { MODAL_DEFAULT_CONFIG_PROVIDER } from './service/modal/modal-config';

import { NzTreeModule } from 'ng-zorro-antd/tree';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';

import { ModalModule } from './service/modal/modal.module';

import { SizePipe } from './pipes/size.pipe';
import { DurationPipe } from './pipes/duration.pipe';
import { FileTypePipe } from './pipes/file-type.pipe';
import { TimePipe } from './pipes/time.pipe';
import { VideoPlayerComponent } from './components/video-player/video-player.component';
import { IsFolderPipe } from './pipes/is-folder.pipe';
import { InvitationModalComponent } from './components/invitation-modal/invitation-modal.component';
import { ToolModalComponent } from './components/tool-modal/tool-modal.component';
import { ReflectorModalComponent } from './components/reflector-modal/reflector-modal.component';
import { LoadingDirective } from './directives/loading.directive';
import { LoadingComponent } from './components/loading/loading.component';
import { DeviceInfoComponent } from './components/device-info/device-info.component';
import { SafeUrlPipe } from './pipes/safe-url.pipe';
import { InstallationModalComponent } from './components/installation-modal/installation-modal.component';
import { DropdownSelectComponent } from './components/dropdown-select/dropdown-select.component';
import { DropdownSelectOptionsComponent } from './components/dropdown-select-options/dropdown-select-options.component';
import { ToolTipComponent } from './components/tool-tip/tool-tip.component';
import { AboutModalComponent } from './components/about-modal/about-modal.component';
import { HelpModalComponent } from './components/help-modal/help-modal.component';

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
  InvitationModalComponent,
  ToolModalComponent,
  ReflectorModalComponent,
  LoadingComponent,
  InstallationModalComponent,
  DropdownSelectComponent,
  ToolTipComponent,
  AboutModalComponent,
  HelpModalComponent
];
const DIRECTIVES = [
  LoadingDirective,
];

const PIPES = [
  SizePipe,
  DurationPipe,
  FileTypePipe,
  TimePipe,
  IsFolderPipe,
  SafeUrlPipe,
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
    InvitationModalComponent,
    ToolModalComponent,
    ReflectorModalComponent,
    LoadingDirective,
    LoadingComponent,
    DeviceInfoComponent,
    SafeUrlPipe,
    SafeUrlPipe,
    InstallationModalComponent,
    DropdownSelectComponent,
    DropdownSelectOptionsComponent
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
    ModalModule,
    NzToolTipModule,
  ],
  providers: [
    MESSAGE_DEFAULT_CONFIG_PROVIDER,
    MODAL_DEFAULT_CONFIG_PROVIDER,
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
    InvitationModalComponent,
    ToolModalComponent,
    ReflectorModalComponent,
    LoadingComponent,
    InstallationModalComponent,
    DropdownSelectOptionsComponent,
    ToolTipComponent,
    AboutModalComponent,
    HelpModalComponent,
  ],
})
export class SharedModule { }
