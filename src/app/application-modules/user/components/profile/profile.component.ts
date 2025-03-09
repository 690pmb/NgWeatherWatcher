import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {MenuService} from '@services/menu.service';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {faBellSlash} from '@fortawesome/free-solid-svg-icons';
import {NotificationService} from '@services/notification.service';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatButtonModule} from '@angular/material/button';
import {SearchLocationComponent} from '../../../../shared/component/search-location/search-location.component';
import {AsyncPipe} from '@angular/common';
import {DropDownChoice} from '@model/dropdown-choice';
import {MatOption, MatSelect, MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {EditUser} from '@model/edit-user';
import {LangComponent} from '@shared/component/lang/lang.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    SearchLocationComponent,
    MatButtonModule,
    FontAwesomeModule,
    AsyncPipe,
    MatFormFieldModule,
    LangComponent,
    MatSelectModule,
    TranslatePipe,
    MatSelect,
    MatOption,
  ],
})
export class ProfileComponent implements OnInit {
  faBellSlash = faBellSlash;
  timezones: DropDownChoice<string>[] = Intl.supportedValuesOf('timeZone').map(
    tz => ({key: tz, value: tz.replace('_', ' ')}),
  );

  constructor(
    private menuService: MenuService,
    protected authService: AuthService,
    protected translateService: TranslateService,
    private notificationService: NotificationService,
  ) {}

  ngOnInit() {
    this.menuService.title$.next(
      this.translateService.instant('user.profile.title') as string,
    );
  }

  edit(user: Partial<EditUser>): void {
    this.authService.edit(user);
  }

  delete(): void {
    this.notificationService.deleteOthers().subscribe();
  }
}
