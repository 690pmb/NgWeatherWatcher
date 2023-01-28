import {Component, OnInit} from '@angular/core';
import {AuthService} from './service/auth.service';
import {NotificationService} from './service/notification.service';
import {filter} from 'rxjs/operators';
import {Token} from './model/token';
import {environment} from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    private notificationService: NotificationService
  ) {}

  ngOnInit(): void {
    this.auth.getCurrentUser();
    this.auth.token$
      .pipe(filter((t): t is Token => !!t && environment.production))
      .subscribe(() => this.notificationService.subscribeToNotifications());
  }
}
