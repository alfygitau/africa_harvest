import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LayoutComponent } from './layouts/layout.component';
import { AuthGuard } from './core/guards/auth.guard';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    loadChildren: () =>
      import('./pages/pages.module').then((m) => m.PagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'pages',
    loadChildren: () =>
      import('./extrapages/extrapages.module').then((m) => m.ExtrapagesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.module').then((m) => m.AccountModule),
  },
  {
    path: 'auth',
    loadChildren: () =>
      import('./account/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'courses',
    component: LayoutComponent,
    loadChildren: () =>
      import('./courses/courses.module').then((m) => m.CoursesModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'farmers',
    component: LayoutComponent,
    loadChildren: () =>
      import('./farmers/farmers.module').then((m) => m.FarmersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'groups',
    component: LayoutComponent,
    loadChildren: () =>
      import('./groups/groups.module').then((m) => m.GroupsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'seeds-distribution',
    component: LayoutComponent,
    loadChildren: () =>
      import('./seeds-dist/seeds-dist.module').then((m) => m.SeedsDistModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'reports',
    component: LayoutComponent,
    loadChildren: () =>
      import('./reports/reports.module').then((m) => m.ReportsModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'users',
    component: LayoutComponent,
    loadChildren: () =>
      import('./users/users.module').then((m) => m.UsersModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'tots',
    component: LayoutComponent,
    loadChildren: () =>
      import('./tots/tots.module').then((m) => m.TotsModule),
    canActivate: [AuthGuard],
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { scrollPositionRestoration: 'top' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
