import {Component, OnInit, OnDestroy, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {faBars, faSignOutAlt, faHome} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, Subscription} from 'rxjs';
import {MatSidenav} from '@angular/material/sidenav';
import {AuthService} from '../../../service/auth.service';
import {MenuService} from '../../../service/menu.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  isLogged$ = new BehaviorSubject<boolean>(false);

  @ViewChild('sidenav', {static: false}) sidenav!: MatSidenav;
  faBars = faBars;
  faSignOutAlt = faSignOutAlt;
  faHome = faHome;

  constructor(
    public authService: AuthService,
    private router: Router,
    public menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.token$.subscribe(token => {
        if (token) {
          this.isLogged$.next(true);
        } else {
          this.isLogged$.next(false);
        }
      })
    );
  }

  logout(): void {
    this.authService.logout(true);
    this.router.navigate(['/user/signin']).catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
