import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Predicate } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Forecast } from '../../../../model/forecast';
import { ForecastDay } from '../../../../model/forecast-day';
import { Hour } from '../../../../model/hour';

@Component({
    selector: 'app-dashboard-details',
    templateUrl: './dashboard-details.component.html',
    styleUrls: ['./dashboard-details.component.scss']
})
export class DashboardDetailsComponent implements OnInit, OnDestroy {
    date: string;
    forecast: Forecast;
    forecastDay: ForecastDay;
    hours: Hour[];
    columnsToDisplay = [
        'time',
        'condition',
        'tempC',
        'windKph',
        'precipMm',
        'chanceOfRain'
    ];
    showAll = false;
    pageIndex: number;
    subs: Subscription[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.subs.push(
            this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
                if (params) {
                    const date = params.get('date');
                    if (date) {
                        this.date = date;
                        this.forecast = this.location.getState() as Forecast;
                        if (!this.forecast || !this.forecast.forecastDay) {
                            this.router
                                .navigateByUrl('dashboard')
                                .catch(err => console.error(err));
                        } else {
                            this.forecastDay = this.forecast.forecastDay.find(
                                day => day.date === this.date
                            );
                            this.onFilterAndPaginate(false, 0);
                        }
                    }
                }
            })
        );
    }

    onFilterAndPaginate(showAll: boolean, pageIndex: number): void {
        this.showAll = showAll;
        this.pageIndex = pageIndex;
        if (this.showAll) {
            this.hours = this.forecastDay.hour.slice(
                this.pageIndex * 12,
                (this.pageIndex + 1) * 12
            );
        } else {
            this.hours = this.forecastDay.hour.filter(
                h => new Date(h.time).getHours() % 3 === 0
            );
        }
    }

    onSwipe(canSwipe: Predicate<number>, next: 1 | -1): void {
        const index = this.forecast.forecastDay
            .map(day => day.date)
            .indexOf(this.date);
        if (canSwipe(index)) {
            this.forecastDay = this.forecast.forecastDay[index + next];
            this.date = this.forecastDay.date;
            this.onFilterAndPaginate(this.showAll, 0);
        }
    }

    onSwipeLeft(): void {
        this.onSwipe(i => i < this.forecast.forecastDay.length - 1, 1);
    }

    onSwipeRight(): void {
        this.onSwipe(i => i > 0, -1);
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
