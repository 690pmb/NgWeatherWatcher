import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLinkWithHref,
  RouterOutlet,
} from '@angular/router';
import {
  faBars,
  faBell,
  faHome,
  faSignOutAlt,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, fromEvent, Subscription} from 'rxjs';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import {AuthService} from '@services/auth.service';
import {MenuService} from '@services/menu.service';
import {throttleTime, map, filter, distinctUntilChanged} from 'rxjs/operators';
import {MenuItem} from '@model/menu-item';
import {AsyncPipe, NgClass} from '@angular/common';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';
import {MatToolbarModule} from '@angular/material/toolbar';
import {TranslatePipe} from '@ngx-translate/core';
import {MatListModule} from '@angular/material/list';

type Direction = 'DOWN' | 'UP';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    trigger('toggle', [
      state('UP', style({opacity: 1, transform: 'translateY(0)'})),
      state('DOWN', style({opacity: 0, transform: 'translateY(-100%)'})),
      transition('* => *', animate('100ms ease-in')),
    ]),
    trigger('menu', [
      state('UP', style({top: '56px'})),
      state('DOWN', style({top: 0})),
      transition('* => *', animate('100ms ease-in')),
    ]),
  ],
  imports: [
    AsyncPipe,
    NgClass,
    FontAwesomeModule,
    MatButtonModule,
    MatListModule,
    MatSidenavModule,
    MatToolbarModule,
    TranslatePipe,
    RouterOutlet,
    RouterLinkWithHref,
  ],
  standalone: true,
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @HostBinding('style.--menu-width')
  protected menuWidth?: string;

  @ViewChild('sidenav', {static: false}) sidenav!: MatSidenav;

  subs: Subscription[] = [];
  readonly toolbarHeight = 56;
  isLogged$ = new BehaviorSubject<boolean>(false);
  faBars = faBars;
  faSignOutAlt = faSignOutAlt;
  direction: Direction = 'UP';
  title = '';
  menuItems: MenuItem[] = [
    {route: '/dashboard', icon: faHome, label: 'nav-bar.dashboard'},
    {route: '/user/profile', icon: faUser, label: 'user.profile.title'},
    {route: '/alert', icon: faBell, label: 'nav-bar.alert'},
  ];

  constructor(
    public authService: AuthService,
    private router: Router,
    public menuService: MenuService,
    private cdk: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.authService.token$.subscribe(token => {
        if (token) {
          this.isLogged$.next(true);
        } else {
          this.isLogged$.next(false);
        }
      }),
    );
    this.menuService.title$.subscribe(t => {
      this.title = t;
      this.cdk.detectChanges();
    });
    this.router.events
      .pipe(filter(e => e instanceof NavigationEnd))
      .subscribe(() => (this.direction = 'UP'));
  }

  ngAfterViewInit(): void {
    fromEvent(window, 'scroll')
      .pipe(
        throttleTime(25),
        map(() => document?.querySelector('html')?.scrollTop ?? 0),
        map(y => {
          if (this.direction === 'UP' && y > this.toolbarHeight) {
            return 'DOWN';
          } else if (this.direction === 'DOWN' && y < this.toolbarHeight) {
            return 'UP';
          } else {
            return this.direction;
          }
        }),
        distinctUntilChanged(),
      )
      .subscribe(dir => {
        this.direction = dir;
        this.cdk.detectChanges();
      });
    this.setMenuWidth();
  }

  logout(): void {
    this.authService.logout(true);
    this.router.navigate(['/user/signin']).catch(err => console.error(err));
  }

  setMenuWidth(): void {
    if (this.sidenav) {
      setTimeout(() => (this.menuWidth = `${this.sidenav._getWidth()}px`));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
