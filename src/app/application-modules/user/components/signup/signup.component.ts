import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {ToastService, AuthService} from '../../../../shared/shared.module';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  username: string;
  password: string;
  password2: string;
  favouriteLocation: string;
  message: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService
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
        .signup(this.username, this.password, this.favouriteLocation)
        .then(status => {
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
        })
        .catch(err => this.authService.handleError(err));
    }
  }
}
