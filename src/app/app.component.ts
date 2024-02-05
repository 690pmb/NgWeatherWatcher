import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {NotificationService} from '@services/notification.service';
import {filter} from 'rxjs/operators';
import {Token} from '@model/token';
import {environment} from '../environments/environment';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private notificationService: NotificationService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser();
    this.auth.token$.pipe(filter((t): t is Token => !!t)).subscribe(t => {
      if (environment.production) {
        this.notificationService.subscribeToNotifications();
      }
      this.translateService.use(t.lang);
    });
  }
}
