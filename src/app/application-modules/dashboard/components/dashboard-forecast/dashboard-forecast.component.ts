/* eslint-disable max-lines-per-function */
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {TranslateService, TranslatePipe} from '@ngx-translate/core';
import {combineLatest, EMPTY, Observable, Observer, Subscription} from 'rxjs';
import {distinctUntilChanged, filter, map, mergeMap} from 'rxjs/operators';
import {Forecast} from '@model/weather/forecast';
import {WeatherService} from '@services/weather.service';
import {AuthService} from '@services/auth.service';
import {ToastService} from '@services/toast.service';
import {MenuService} from '@services/menu.service';
import {Token} from '@model/token';
import {IconPipe} from '@shared/pipe/icon.pipe';
import {DateTimePipe} from '@shared/pipe/date-time.pipe';
import {MatDividerModule} from '@angular/material/divider';
import {SearchLocationComponent} from '@shared/component/search-location/search-location.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

import {DashboardComponent} from '../dashboard/dashboard.component';
import {AsyncPipe} from '@angular/common';
import {LangService} from '@services/lang.service';

@Component({
  selector: 'app-dashboard-forecast',
  templateUrl: './dashboard-forecast.component.html',
  styleUrls: ['./dashboard-forecast.component.scss'],
  standalone: true,
  imports: [
    DashboardComponent,
    MatProgressSpinnerModule,
    SearchLocationComponent,
    RouterLink,
    MatDividerModule,
    DateTimePipe,
    IconPipe,
    AsyncPipe,
    TranslatePipe,
  ],
})
export class DashboardForecastComponent implements OnInit, OnDestroy {
  forecast?: Forecast;
  location?: string;
  showSpinner = false;
  subs: Subscription[] = [];

  constructor(
    private weatherService: WeatherService,
    protected translate: TranslateService,
    protected authService: AuthService,
    protected langService: LangService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private toast: ToastService,
    private menuService: MenuService,
  ) {}

  ngOnInit(): void {
    this.subs.push(
      combineLatest([
        this.authService.token$.pipe(
          filter((t): t is Token => t !== undefined),
          map(token => (token.location ? token.location : undefined)),
        ),
        this.activatedRoute.queryParamMap.pipe(filter(q => q !== undefined)),
      ])
        .pipe(
          mergeMap(([location, query]) => {
            const queryLocation = query.get('location');
            if (queryLocation === null) {
              return new Observable((observer: Observer<string>) => {
                if (location) {
                  observer.next(location);
                } else {
                  this.showSpinner = true;
                  WeatherService.findUserPosition(observer);
                }
              });
            } else {
              return EMPTY;
            }
          }),
        )
        .subscribe(
          (location: string) => this.navigate(location),
          (err: string) => {
            this.showSpinner = false;
            this.toast.info(err);
          },
        ),
    );
    this.subs.push(
      combineLatest([
        this.langService.getLang(),
        this.activatedRoute.queryParamMap.pipe(
          filter(q => q !== undefined),
          map(query => query.get('location')),
          filter(
            (l): l is string =>
              typeof l === 'string' && l !== null && l.trim() !== '',
          ),
          distinctUntilChanged(),
        ),
      ]).subscribe(
        ([lang, location]) => this.searchForecast(location, lang),
        (err: string) => this.weatherService.handleError(err),
      ),
    );
  }

  searchForecast(location: string, lang: string): void {
    this.showSpinner = false;
    this.location = location;
    this.weatherService.findForecastByLocation(location, '3', lang).subscribe(
      forecast => {
        this.menuService.title$.next(
          `${forecast.location.name}, ${forecast.location.region} - ${forecast.location.country}`,
        );
        this.menuService.location = forecast.location.name;
        this.forecast = forecast;
      },
      (err: string) => this.weatherService.handleError(err),
    );
  }

  navigate(location: string): void {
    if (location) {
      this.router
        .navigate(['.'], {
          queryParams: {location},
          relativeTo: this.activatedRoute,
        })
        .catch(err => console.error(err));
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
