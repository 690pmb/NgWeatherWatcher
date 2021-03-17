import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../shared/service/auth.service';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
    username = '';
    password = '';
    message = '';

    constructor(
        private auth: AuthService,
        private router: Router,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {}

    login(): void {
        if (this.username && this.password) {
            this.auth.signin(this.username, this.password).then(isAuth => {
                if (isAuth) {
                    this.message = this.translate.instant(
                        'user.signin.connected'
                    );
                    const redirectPage = sessionStorage.getItem('redirectPage');
                    if (redirectPage) {
                        this.router.navigate([redirectPage]);
                    } else {
                        this.router.navigateByUrl('/');
                    }
                } else {
                    this.message = this.translate.instant('user.signin.wrong');
                }
            });
        }
    }
}
