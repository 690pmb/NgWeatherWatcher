import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Observer, Subscription } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { Forecast } from '../../model/forecast';
import { AuthService, ToastService, WeatherService } from '../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  forecast: Forecast;
  showSpinner = false;
  subs: Subscription[] = [];

  constructor(
    private weatherService: WeatherService,
    private translate: TranslateService,
    private authService: AuthService,
    private toast: ToastService,
  ) { }

  ngOnInit(): void {
    this.subs.push(this.authService.token$.pipe(map(token => {
      if (token && token.location) {
        return WeatherService.encodeQueryUrl(token.location);
      } else {
        return undefined;
      }
    }), mergeMap(location => {
      return new Observable((observer: Observer<string>) => {
        if (location) {
          observer.next(location);
        } else {
          this.showSpinner = true;
          WeatherService.findUserPosition(observer);
        }
      });
    })).subscribe(location => {
      this.showSpinner = false;
      this.searchForecast(location);
    }, err => {
      this.showSpinner = false;
      this.toast.info(err);
    }));
  }

  searchForecast(location: string): void {
    this.weatherService.findForecastByLocation(location, '5', this.translate.currentLang)
      .then(forecast => this.forecast = forecast);
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe);
  }

}
