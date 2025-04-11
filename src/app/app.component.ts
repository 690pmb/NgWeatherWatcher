import {Component, OnInit} from '@angular/core';
import {AuthService} from '@services/auth.service';
import {filter} from 'rxjs/operators';
import {MenuComponent} from './shared/component/menu/menu.component';
import {NavigationError, Router} from '@angular/router';
import {ToastService} from '@services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [MenuComponent],
})
export class AppComponent implements OnInit {
  constructor(
    private auth: AuthService,
    router: Router,
    toast: ToastService,
  ) {
    router.events
      .pipe(filter((e): e is NavigationError => e instanceof NavigationError))
      .subscribe(e => {
        toast.error(e.error.message as string);
        router.navigateByUrl('/dashboard');
      });
  }

  ngOnInit(): void {
    this.auth.getCurrentUser();
  }
}
