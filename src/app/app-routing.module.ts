import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../app/shared/components/page-not-found/page-not-found.component';

// layout
import { LayoutDefaultComponent } from './layout/default/default.component';
import { LayoutDesktopComponent } from './layout/desktop/desktop.component';

// connection pages
import { ConnectionComponent } from './shared/components/connection/connection.component';

// cloud pages

// device pages

const routes: Routes = [
  {
    path: '',
    component: LayoutDesktopComponent,
    children: [
      { path: '', redirectTo: 'connect', pathMatch: 'full'},
      { path: 'connect', component: ConnectionComponent },
    ],
  },
  // cloud
  {
    path: 'cloud',
    component: LayoutDefaultComponent,
    children: [],
  },
  // device
  {
    path: 'device',
    component: LayoutDefaultComponent,
    children: [],
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
