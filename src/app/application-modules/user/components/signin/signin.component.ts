import {Component} from '@angular/core';
import {Router, RouterLink} from '@angular/router';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {AuthService} from '@services/auth.service';
import {MatButtonModule} from '@angular/material/button';
import {NgIf} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    NgIf,
    MatButtonModule,
    RouterLink,
    TranslatePipe,
  ],
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
