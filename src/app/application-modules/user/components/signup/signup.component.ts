import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {AuthService} from '@services/auth.service';
import {ToastService} from '@services/toast.service';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {MatButtonModule} from '@angular/material/button';
import {SearchLocationComponent} from '@shared/component/search-location/search-location.component';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';

import {FormsModule} from '@angular/forms';
import {LangComponent} from '@shared/component/lang/lang.component';
import {LangService} from '@services/lang.service';
import {AsyncPipe} from '@angular/common';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    SearchLocationComponent,
    MatButtonModule,
    LangComponent,
    RouterLink,
    TranslatePipe,
    AsyncPipe,
  ],
})
export class SignupComponent implements OnInit {
  username?: string;
  password?: string;
  password2?: string;
  favouriteLocation?: string;
  lang?: string;
  message?: string;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    protected translateService: TranslateService,
    protected langService: LangService,
  ) {}

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
      this.username = params['username'] ? (params['username'] as string) : '';
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
          this.lang ?? this.translateService.currentLang,
          this.favouriteLocation,
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
          (err: Error) => this.authService.handleError(err),
        );
    }
  }

  onLangChange(lang: string): void {
    this.lang = lang;
    this.langService.setLang(lang);
  }
}
