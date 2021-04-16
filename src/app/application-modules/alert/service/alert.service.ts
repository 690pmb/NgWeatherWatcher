import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';
import { Alert } from '../../../model/alert/alert';
import { DayOfWeek } from '../../../model/alert/day-of-week';
import { ToastService } from '../../../shared/service/toast.service';
import { UtilsService } from '../../../shared/service/utils.service';
import { Utils } from '../../../shared/utils';
import { AlertDto } from './alert-dto';

@Injectable({
    providedIn: 'root'
})
export class AlertService extends UtilsService {
    constructor(
        protected httpClient: HttpClient,
        protected toast: ToastService
    ) {
        super(httpClient, toast);
    }

    getAllByUser(): Observable<AlertDto[]> {
        return this.getObservable<Alert[]>(
            `${environment.apiUrl}/${environment.alertUrl}`,
            []
        ).pipe(
            map(alerts =>
                alerts.map((a: AlertDto) => {
                    a.triggerHourDate = Utils.parseOffsetTime(a.triggerHour);
                    a.monitoredHoursDate = a.monitoredHours
                        .map(h => Utils.parseOffsetTime(h))
                        .sort();
                    a.triggerDaysEnum = a.triggerDays.map(
                        day => DayOfWeek[day as keyof typeof DayOfWeek]
                    );
                    return a;
                })
            )
        );
    }
}
