import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {NotificationService} from '@services/notification.service';
import {filter} from 'rxjs/operators';
import {Token} from '@model/token';
import {environment} from '../environments/environment';
import {TranslateService} from '@ngx-translate/core';
import {MenuComponent} from './shared/component/menu/menu.component';
import {NavigationError, Router} from '@angular/router';
import {ToastService} from '@services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MenuComponent],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private notificationService: NotificationService,
    private translateService: TranslateService,
    router: Router,
    toast: ToastService,
  ) {
    router.events
      .pipe(filter((e): e is NavigationError => e instanceof NavigationError))
      .subscribe(e => {
        toast.error(e.error.message as string);
        router.navigateByUrl('/dashboard');
      });
  }

  ngOnInit(): void {
    this.auth.getCurrentUser();
    this.auth.token$.pipe(filter((t): t is Token => !!t)).subscribe(t => {
      if (environment.production) {
        this.notificationService.subscribeToNotifications();
      }
      this.translateService.use(t.lang === 'fr' ? 'fr' : 'en');
    });
  }
}
