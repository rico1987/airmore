import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

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
import { GridListComponent } from './components/grid-list/grid-list.component';;

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
];
const DIRECTIVES = [];

@NgModule({
  declarations: [
    ...COMPONENTS,
    ...DIRECTIVES,
    DesktopComponent,
    GridListComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  providers: [
  ],
  exports: [
    RouterModule,
    TranslateModule,
    ...COMPONENTS,
    ...DIRECTIVES,
  ],
})
export class SharedModule { }
