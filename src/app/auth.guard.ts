import {
  Router,
  UrlTree,
  CanActivateFn,
  ActivatedRouteSnapshot,
} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AuthService} from '@services/auth.service';
import {inject} from '@angular/core';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
): Observable<UrlTree | boolean> => {
  const auth = inject(AuthService);
  const router = inject(Router);
  try {
    return auth.isAuthenticated().pipe(
      map(isAuth => {
        if (!isAuth) {
          sessionStorage.setItem('redirectPage', route.url.join('/'));
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
