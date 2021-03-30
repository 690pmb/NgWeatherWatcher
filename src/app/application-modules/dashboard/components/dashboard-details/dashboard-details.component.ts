import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit, Predicate } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { combineLatest, Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Forecast } from '../../../../model/forecast';
import { ForecastDay } from '../../../../model/forecast-day';
import { Hour } from '../../../../model/hour';
import { slideInOutAnimation } from './slide-in-out';

@Component({
    selector: 'app-dashboard-details',
    templateUrl: './dashboard-details.component.html',
    styleUrls: ['./dashboard-details.component.scss'],
    animations: [slideInOutAnimation]
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
    pageSize = 8;
    index: number;
    subs: Subscription[] = [];

    constructor(
        private activatedRoute: ActivatedRoute,
        private location: Location,
        private router: Router,
        private translate: TranslateService
    ) {}

    ngOnInit(): void {
        this.subs.push(
            combineLatest([
                this.activatedRoute.paramMap.pipe(filter(p => p !== undefined)),
                this.activatedRoute.queryParamMap.pipe(
                    filter(q => q !== undefined)
                )
            ]).subscribe(([params, queryParam]) => {
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
                        this.index = this.getIndex();
                        this.filterAndPaginate(
                            queryParam.get('showAll') === 'true',
                            0
                        );
                    }
                }
            })
        );
    }

    filterAndPaginate(showAll: boolean, pageIndex: number): void {
        this.showAll = showAll;
        this.pageIndex = pageIndex;
        if (this.showAll) {
            this.hours = this.forecastDay.hour.slice(
                this.pageIndex * this.pageSize,
                (this.pageIndex + 1) * this.pageSize
            );
        } else {
            this.hours = this.forecastDay.hour.filter(
                h => new Date(h.time).getHours() % 3 === 0
            );
        }
    }

    getIndex(): number {
        return this.forecast.forecastDay
            .map(day => day.date)
            .indexOf(this.date);
    }

    onSwipe(canSwipe: Predicate<number>, next: 1 | -1): void {
        const index = this.getIndex();
        if (canSwipe(index)) {
            this.navigate(this.forecast.forecastDay[this.index + next].date);
        }
    }

    navigate(date: string): void {
        this.router
            .navigate(['/dashboard/details/' + date], {
                queryParams: { showAll: this.showAll },
                state: this.forecast,
                replaceUrl: true
            })
            .catch(err => console.error(err));
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
