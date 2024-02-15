import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable, of} from 'rxjs';
import {AuthService} from '@services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  canActivate(
    _route: ActivatedRouteSnapshot, // eslint-disable-line
    state: RouterStateSnapshot
  ): Observable<UrlTree | boolean> {
    try {
      return this.auth.isAuthenticated().pipe(
        map(isAuth => {
          if (!isAuth) {
            this.router
              .navigate(['/user/signin'])
              .catch(err => console.error(err));
            sessionStorage.setItem('redirectPage', state.url);
            return false;
          }
          return true;
        })
      );
    } catch (err) {
      console.error('guard error', err);
      return of(false);
    }
  }
}
