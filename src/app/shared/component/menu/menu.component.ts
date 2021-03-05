import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Router } from '@angular/router';
import { faBars, faPowerOff, faHome } from '@fortawesome/free-solid-svg-icons';
import { BehaviorSubject, Subscription } from 'rxjs';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  subs: Subscription[] = [];
  isLogged$ = new BehaviorSubject<boolean>(false);

  faBars = faBars;
  faPowerOff = faPowerOff;
  faHome = faHome;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor(
    public authService: AuthService,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.subs.push(this.authService.token$.subscribe(token => {
      if (token) {
        this.isLogged$.next(true);
      } else {
        this.isLogged$.next(false);
      }
    }));
  }

  logout(): void {
    this.authService.logout(true);
    this.router.navigate(['/user/signin']);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}
