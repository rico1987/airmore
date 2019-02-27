import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PageNotFoundComponent } from '../app/shared/components/page-not-found/page-not-found.component';

// preload strategy
import { SelectivePreloadingStrategyService } from './selective-preloading-strategy.service';

// layout
import { LayoutDefaultComponent } from './layout/default/default.component';
import { LayoutDesktopComponent } from './layout/desktop/desktop.component';

// connection pages
import { ConnectionComponent } from './shared/components/connection/connection.component';

// cloud pages

// device pages

const appRoutes: Routes = [
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
    loadChildren: './cloud/cloud.module#CloudModule',
  },
  // device
  {
    path: 'device',
    component: LayoutDefaultComponent,
    loadChildren: './device/device.module#DeviceModule',
  },
  { path: '**', component: PageNotFoundComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(
      appRoutes,
      {
        enableTracing: false, // <-- debugging purposes only
        preloadingStrategy: SelectivePreloadingStrategyService,
      }
    )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
