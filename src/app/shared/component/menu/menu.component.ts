import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  Component,
  OnInit,
  OnDestroy,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
} from '@angular/core';
import {Router} from '@angular/router';
import {
  faBars,
  faBell,
  faHome,
  faSignOutAlt,
} from '@fortawesome/free-solid-svg-icons';
import {BehaviorSubject, Subscription} from 'rxjs';
import {MatSidenav, MatSidenavContent} from '@angular/material/sidenav';
import {AuthService} from '../../../service/auth.service';
import {MenuService} from '../../../service/menu.service';
import {
  throttleTime,
  map,
  pairwise,
  distinctUntilChanged,
} from 'rxjs/operators';

type Direction = 'UP' | 'DOWN';

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
})
export class MenuComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sidenav', {static: false}) sidenav!: MatSidenav;
  @ViewChild('content', {static: false}) content!: MatSidenavContent;
  subs: Subscription[] = [];
  isLogged$ = new BehaviorSubject<boolean>(false);
  faBars = faBars;
  faSignOutAlt = faSignOutAlt;
  faHome = faHome;
  faBell = faBell;
  direction: Direction = 'UP';
  title = '';

  constructor(
    public authService: AuthService,
    private router: Router,
    public menuService: MenuService,
    private cdk: ChangeDetectorRef
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
    this.menuService.title$.subscribe(t => {
      this.title = t;
      this.cdk.detectChanges();
    });
  }

  ngAfterViewInit(): void {
    this.content
      .elementScrolled()
      .pipe(
        throttleTime(100),
        map((e: Event) => (e.target as HTMLElement).scrollTop),
        pairwise(),
        map(([y1, y2]): Direction => (y2 < y1 ? 'UP' : 'DOWN')),
        distinctUntilChanged()
      )
      .subscribe(dir => {
        this.direction = dir;
        this.cdk.detectChanges();
      });
  }

  logout(): void {
    this.authService.logout(true);
    this.router.navigate(['/user/signin']).catch(err => console.error(err));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
