import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../../../service/auth.service';
import {MenuService} from '../../../../service/menu.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  constructor(
    private menuService: MenuService,
    protected authService: AuthService,
    protected translateService: TranslateService
  ) {}

  ngOnInit() {
    this.menuService.title$.next(
      this.translateService.instant('user.profile.title')
    );
  }

  edit(location: string): void {
    this.authService.edit(location);
  }
}
