import {DatePipe, Location} from '@angular/common';
import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {combineLatest, Subscription, Observable, of, EMPTY, iif} from 'rxjs';
import {filter, mergeMap, switchMap} from 'rxjs/operators';
import {Forecast} from '../../../../model/weather/forecast';
import {ForecastDay} from '../../../../model/weather/forecast-day';
import {Hour} from '../../../../model/weather/hour';
import {Utils} from '../../../../shared/utils';
import {slideInOutAnimation} from './slide-in-out';
import {MenuService} from '../../../../service/menu.service';
import {WeatherService} from '../../../../service/weather.service';

@Component({
  selector: 'app-dashboard-details',
  templateUrl: './dashboard-details.component.html',
  styleUrls: ['./dashboard-details.component.scss'],
  animations: [slideInOutAnimation],
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {
  date!: string;
  forecast!: Forecast;
  forecastDay?: ForecastDay;
  place?: string;
  hours: Hour[] = [];
  columnsToDisplay = [
    'time',
    'condition',
    'tempC',
    'windKph',
    'precipMm',
    'chanceOfRain',
  ];

  showAll = false;
  pageIndex!: number;
  pageSize = 8;
  index!: number;
  subs: Subscription[] = [];
  formatFields: {[key: string]: (h: Hour) => string} = {
    feelsLike: h => `${h.feelsLikeC} °C`,
    cloud: h => `${h.cloud} %`,
    humidity: h => `${h.humidity} %`,
    uv: h => `${h.uv}`,
    pressure: h => `${h.pressureMb} mbar`,
    willItRain: h =>
      `${this.translate.instant(`global.${h.willItRain === 1}`)}`,
    willItSnow: h =>
      `${this.translate.instant(`global.${h.willItSnow === 1}`)}`,
    chanceOfSnow: h => `${h.chanceOfSnow} %`,
  };

  constructor(
    private weatherService: WeatherService,
    private activatedRoute: ActivatedRoute,
    private location: Location,
    private router: Router,
    private translate: TranslateService,
    private menuService: MenuService,
    private datePipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.subs.push(
      combineLatest([
        this.activatedRoute.paramMap.pipe(filter(p => p !== undefined)),
        this.activatedRoute.queryParamMap.pipe(filter(q => q !== undefined)),
      ]).subscribe(([params, queryParam]) => {
        const date = params.get('date');
        this.place = queryParam.get('location') ?? undefined;
        if (date) {
          this.date = date;
          this.getForecast().subscribe(forecast => {
            this.forecast = forecast;
            this.menuService.title$.next(
              `${this.forecast.location.name} - ${this.datePipe.transform(
                this.date,
                'fullDate',
                '',
                this.translate.currentLang
              )}`
            );
            this.forecastDay = this.forecast.forecastDay.find(
              day => day.date === this.date
            );
            this.index = this.getIndex();
            this.filterAndPaginate(
              queryParam.get('showAll') === 'true',
              +Utils.getOrElse(queryParam.get('page'), '0')
            );
          });
        }
      })
    );
  }

  getForecast(): Observable<Forecast> {
    return of(this.location.getState() as Forecast).pipe(
      mergeMap(forecast =>
        iif(
          () => !forecast || !forecast.forecastDay,
          of(this.place).pipe(
            switchMap(place => {
              if (place) {
                return this.weatherService.findForecastByLocation(
                  place,
                  '5',
                  this.translate.currentLang
                );
              } else {
                this.router
                  .navigateByUrl('dashboard')
                  .catch(err => console.error(err));
                return EMPTY;
              }
            })
          ),
          of(forecast)
        )
      )
    );
  }

  filterAndPaginate(showAll: boolean, pageIndex: number): void {
    this.showAll = showAll;
    this.pageIndex = pageIndex;
    if (this.showAll) {
      this.hours =
        this.forecastDay?.hour.slice(
          this.pageIndex * this.pageSize,
          (this.pageIndex + 1) * this.pageSize
        ) ?? [];
    } else {
      this.hours =
        this.forecastDay?.hour.filter(
          h => new Date(h.time).getHours() % 3 === 0
        ) ?? [];
    }
  }

  getIndex(): number {
    return this.forecast.forecastDay.map(day => day.date).indexOf(this.date);
  }

  onSwipe(
    canSwipeNextDay: (i: number, p: number) => boolean,
    canSwipeNextPage: (p: number) => boolean,
    next: 1 | -1
  ): void {
    const index = this.getIndex();
    if (canSwipeNextDay(index, this.pageIndex)) {
      this.navigate(
        this.forecast.forecastDay[this.index + next].date,
        this.showAll ? (this.pageIndex === 0 ? 2 : 1) : 0
      );
    } else if (canSwipeNextPage(this.pageIndex)) {
      this.navigate(this.date, this.pageIndex + next);
    }
  }

  navigate(date: string, page: number): void {
    this.router
      .navigate([`/dashboard/details/${date}`], {
        queryParams: {showAll: this.showAll, page},
        state: this.forecast,
        replaceUrl: true,
      })
      .catch(err => console.error(err));
  }

  onSwipeLeft(): void {
    this.onSwipe(
      (i, p) =>
        (!this.showAll && i < this.forecast.forecastDay.length - 1) ||
        (this.showAll && p === 2 && i < this.forecast.forecastDay.length - 1),
      p => this.showAll && p < 2,
      1
    );
  }

  onSwipeRight(): void {
    this.onSwipe(
      i =>
        (!this.showAll && i > 0) ||
        (this.showAll && i > 0 && this.pageIndex === 0),
      p => this.showAll && p > 0,
      -1
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
