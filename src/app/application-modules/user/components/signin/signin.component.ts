import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {AuthService} from '@services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent {
  username = '';
  password = '';
  message = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {}

  login(): void {
    if (this.username && this.password) {
      this.auth.signin(this.username, this.password).subscribe(
        connected => {
          if (connected) {
            this.message = this.translate.instant(
              'user.signin.connected'
            ) as string;
            const redirectPage = sessionStorage.getItem('redirectPage');
            if (redirectPage) {
              this.router
                .navigate([redirectPage])
                .catch(err => console.error(err));
            } else {
              this.router.navigateByUrl('/').catch(err => console.error(err));
            }
          } else {
            this.message = this.translate.instant(
              'user.signin.wrong'
            ) as string;
          }
        },
        (err: Error) => this.auth.handleError(err)
      );
    }
  }
}
