import { Injectable } from '@angular/core';
import {
    CanActivate,
    ActivatedRouteSnapshot,
    RouterStateSnapshot,
    Router,
    UrlTree
} from '@angular/router';
import { AuthService } from './shared/service/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AuthService, private router: Router) {}

    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        console.log('canActivate', state.url);
        try {
            return this.auth.isAuthenticated().then(isAuth => {
                if (!isAuth) {
                    console.log('not authenticated');
                    this.router
                        .navigate(['/user/signin'])
                        .catch(err => console.error(err));
                    sessionStorage.setItem('redirectPage', state.url);
                    return false;
                }
                console.log('logged in');
                return true;
            });
        } catch (err) {
            console.log('guard error', err);
            return new Promise((resolve, reject) => reject(false));
        }
    }
}
