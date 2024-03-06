import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {MenuService} from '@services/menu.service';
import {TranslateService} from '@ngx-translate/core';
import {faBellSlash} from '@fortawesome/free-solid-svg-icons';
import {NotificationService} from '@services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  faBellSlash = faBellSlash;

  constructor(
    private menuService: MenuService,
    protected authService: AuthService,
    protected translateService: TranslateService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.menuService.title$.next(
      this.translateService.instant('user.profile.title') as string
    );
  }

  edit(location: string): void {
    this.authService.edit(location);
  }

  delete(): void {
    this.notificationService.deleteOthers().subscribe();
  }
}
