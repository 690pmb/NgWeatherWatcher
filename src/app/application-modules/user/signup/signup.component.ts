import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  username: string;
  password: string;
  password2: string;
  message: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(
      params => {
        this.username = params.username ? params.username : '';
      });
  }

  signup(): void {
    this.message = undefined;
    if (this.username && this.password && this.password2 && this.password === this.password2) {
      this.authService.signup(this.username, this.password).then(status => {
        if (status === 409) {
          this.message = 'user.signup.already_exist';
        } else if (status !== 201) {
          this.message = 'user.signup.bad_request';
        } else {
          this.message = 'user.signup.success';
          this.router.navigateByUrl('/user/signin');
        }
      });
    }
  }
}
