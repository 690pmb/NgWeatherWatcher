import {Injectable} from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
  UrlTree,
} from '@angular/router';
import {AuthService} from './service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Promise<boolean | UrlTree> {
    try {
      return this.auth.isAuthenticated().then(isAuth => {
        if (!isAuth) {
          this.router
            .navigate(['/user/signin'])
            .catch(err => console.error(err));
          sessionStorage.setItem('redirectPage', state.url);
          return false;
        }
        return true;
      });
    } catch (err) {
      console.error('guard error', err);
      return new Promise((resolve, reject) => reject(false));
    }
  }
}
