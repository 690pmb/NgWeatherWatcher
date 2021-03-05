import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Forecast } from '../../model/forecast';
import { WeatherService } from '../../shared/shared.module';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  forecast: Forecast;
  subs: Subscription[] = [];

  constructor(
    private weatherService: WeatherService,
    private translate: TranslateService
  ) { }

  ngOnInit(): void {
    this.subs.push(this.weatherService.findForecastByLocation('', '5', this.translate.currentLang)
      .subscribe(forecast => this.forecast = forecast));
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe);
  }

}
