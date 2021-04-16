import { DatePipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { faCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';
import { DayOfWeek } from '../../../../model/alert/day-of-week';
import { MenuService } from '../../../../shared/shared.module';
import { Utils } from '../../../../shared/utils';
import { AlertDto } from '../../service/alert-dto';
import { AlertService } from '../../service/alert.service';

@Component({
    selector: 'app-alert-list',
    templateUrl: './alert-list.component.html',
    styleUrls: ['./alert-list.component.scss']
})
export class AlertListComponent implements OnInit, OnDestroy {
    static readonly workingDays = [
        DayOfWeek.MONDAY,
        DayOfWeek.TUESDAY,
        DayOfWeek.WEDNESDAY,
        DayOfWeek.THURSDAY,
        DayOfWeek.FRIDAY
    ];
    static readonly weekEnd = [DayOfWeek.SATURDAY, DayOfWeek.SUNDAY];
    alerts: AlertDto[];
    shownAlerts: AlertDto[];
    columnsToDisplay = [
        'trigger-day',
        'trigger-hour',
        'monitored-hour',
        'location',
        'force',
        'edit'
    ];
    pageIndex: number;
    pageSize = 10;
    faCheck = faCheck;
    faEdit = faEdit;
    subs: Subscription[] = [];

    constructor(
        private router: Router,
        private alertService: AlertService,
        private activatedRoute: ActivatedRoute,
        private translate: TranslateService,
        private menuService: MenuService,
        private datePipe: DatePipe
    ) {}

    ngOnInit(): void {
        this.menuService.title$.next('');
        this.subs.push(
            this.alertService.getAllByUser().subscribe(alerts => {
                this.alerts = this.prettyAlert(alerts);
                this.subs.push(
                    this.activatedRoute.queryParamMap
                        .pipe(filter(q => q !== undefined))
                        .subscribe(queryParam =>
                            this.filterAndPaginate(
                                Utils.getOrElse(+queryParam.get('page'), 0)
                            )
                        )
                );
            })
        );
    }

    filterAndPaginate(pageIndex: number): void {
        this.pageIndex = pageIndex;
        this.shownAlerts = this.alerts.slice(
            this.pageIndex * this.pageSize,
            (this.pageIndex + 1) * this.pageSize
        );
    }

    prettyAlert(alerts: AlertDto[]): AlertDto[] {
        return alerts.map((alert: AlertDto) => {
            this.mapTriggerDays(alert);
            this.mapMonitoredDays(alert);
            alert.monitoredHoursPretty = alert.monitoredHoursDate.map(h =>
                this.datePipe.transform(h, 'HH:mm')
            );
            return alert;
        });
    }

    private mapTriggerDays(alert: AlertDto) {
        if (Utils.unique(alert.triggerDaysEnum).length === 7) {
            alert.triggerDaysPretty = [
                this.translate.instant('alert.every_days') as string
            ];
        } else if (
            alert.triggerDaysEnum.length ===
                AlertListComponent.workingDays.length &&
            AlertListComponent.workingDays.every(day =>
                alert.triggerDaysEnum.includes(day)
            )
        ) {
            alert.triggerDaysPretty = [
                this.translate.instant('alert.all_working_days') as string
            ];
        } else if (
            alert.triggerDaysEnum.length ===
                AlertListComponent.weekEnd.length &&
            AlertListComponent.weekEnd.every(day =>
                alert.triggerDaysEnum.includes(day)
            )
        ) {
            alert.triggerDaysPretty = [
                this.translate.instant('alert.week_end') as string
            ];
        } else {
            alert.triggerDaysPretty = alert.triggerDays
                .sort(
                    (t1, t2) =>
                        DayOfWeek[t1 as keyof typeof DayOfWeek] -
                        DayOfWeek[t2 as keyof typeof DayOfWeek]
                )
                .map(
                    day =>
                        this.translate.instant(
                            'global.day.' + day.toString().toLowerCase()
                        ) as string
                );
        }
    }

    private mapMonitoredDays(alert: AlertDto) {
        const getMonitoredDayValue = (bool: boolean, key: string) =>
            bool
                ? (this.translate.instant(
                      'alert.monitored_days.' + key
                  ) as string)
                : '';
        alert.monitoredDaysPretty = [
            getMonitoredDayValue(alert.monitoredDays.sameDay, 'same_day'),
            getMonitoredDayValue(alert.monitoredDays.nextDay, 'next_day'),
            getMonitoredDayValue(
                alert.monitoredDays.twoDayLater,
                'two_day_later'
            )
        ]
            .filter(s => Utils.isNotBlank(s))
            .join(', ');
        alert.monitoredDaysPretty =
            alert.monitoredDaysPretty[0].toUpperCase() +
            alert.monitoredDaysPretty.slice(1);
    }

    navigate(page: number): void {
        this.router
            .navigate(['.'], {
                queryParams: { page },
                replaceUrl: true
            })
            .catch(err => console.error(err));
    }

    ngOnDestroy(): void {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}
