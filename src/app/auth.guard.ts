import {Router, UrlTree, CanActivateFn} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AuthService} from '@services/auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (): Observable<UrlTree | boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    return auth.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          return router.parseUrl('/user/signin');
        }
        return true;
      }),
    );
  } catch (err) {
    console.error('guard error', err);
    return of(false);
  }
};
