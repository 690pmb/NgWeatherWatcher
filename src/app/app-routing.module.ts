import {NgModule} from '@angular/core';
import {RouterModule, Routes, Router, NavigationError} from '@angular/router';
import {authGuard} from './auth.guard';
import {filter} from 'rxjs/operators';
import {ToastService} from '@services/toast.service';

const routes: Routes = [
  {path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./application-modules/dashboard/dashboard.module').then(
        m => m.DashboardModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'alert',
    loadChildren: () =>
      import('./application-modules/alert/alert.module').then(
        m => m.AlertModule
      ),
    canActivate: [authGuard],
  },
  {
    path: 'user',
    loadChildren: () =>
      import('./application-modules/user/user.module').then(m => m.UserModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
  constructor(router: Router, toast: ToastService) {
    router.events
      .pipe(filter((e): e is NavigationError => e instanceof NavigationError))
      .subscribe(e => {
        toast.error(e.error.message as string);
        router.navigateByUrl('/dashboard');
      });
  }
}
