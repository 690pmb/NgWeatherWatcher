import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {ToastService} from '@services/toast.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  username?: string;
  password?: string;
  password2?: string;
  favouriteLocation?: string;
  message?: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.username = params.username ? (params.username as string) : '';
    });
  }

  signup(): void {
    this.message = undefined;
    if (
      this.username &&
      this.password &&
      this.password2 &&
      this.password === this.password2
    ) {
      this.authService
        .signup(
          this.username,
          this.password,
          this.translateService.currentLang,
          this.favouriteLocation
        )
        .subscribe(
          status => {
            if (status === 409) {
              this.message = 'user.signup.already_exist';
            } else if (status !== 201) {
              this.message = 'user.signup.bad_request';
            } else {
              this.message = 'user.signup.registred';
              this.toast.success('user.signup.registred');
              this.router
                .navigateByUrl('/user/signin')
                .catch(err => console.error(err));
            }
          },
          (err: Error) => this.authService.handleError(err)
        );
    }
  }
}
