import {Routes} from '@angular/router';
import {authGuard} from './auth.guard';

export const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './application-modules/dashboard/components/dashboard-forecast/dashboard-forecast.component'
          ).then(c => c.DashboardForecastComponent),
      },
      {
        path: 'details/:date',
        loadComponent: () =>
          import(
            './application-modules/dashboard/components/dashboard-details/dashboard-details.component'
          ).then(c => c.DashboardDetailsComponent),
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'alert',
    children: [
      {
        path: '',
        loadComponent: () =>
          import(
            './application-modules/alert/components/alert-list/alert-list.component'
          ).then(c => c.AlertListComponent),
      },
      {
        path: 'create',
        loadComponent: () =>
          import(
            './application-modules/alert/components/alert/alert.component'
          ).then(c => c.AlertComponent),
      },
      {
        path: 'edit/:id',
        loadComponent: () =>
          import(
            './application-modules/alert/components/alert/alert.component'
          ).then(c => c.AlertComponent),
      },
    ],
    canActivate: [authGuard],
  },
  {
    path: 'user',
    children: [
      {
        path: '',
        children: [
          {path: '', redirectTo: 'signin', pathMatch: 'full'},
          {
            path: 'signin',
            loadComponent: () =>
              import(
                './application-modules/user/components/signin/signin.component'
              ).then(c => c.SigninComponent),
          },
          {
            path: 'signup',
            loadComponent: () =>
              import(
                './application-modules/user/components/signup/signup.component'
              ).then(c => c.SignupComponent),
          },
          {
            path: 'profile',
            loadComponent: () =>
              import(
                './application-modules/user/components/profile/profile.component'
              ).then(c => c.ProfileComponent),
          },
        ],
      },
    ],
  },
];
