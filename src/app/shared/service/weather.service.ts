import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Forecast } from '../../model/forecast';
import { Location } from '../../model/location';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';

@Injectable({
    providedIn: 'root'
})
export class WeatherService extends UtilsService {
    constructor(
        protected httpClient: HttpClient,
        protected toast: ToastService
    ) {
        super(httpClient, toast);
    }

    search(term: string): Observable<Location[]> {
        return this.getObservable<Location[]>(
            `${environment.apiUrl}/${environment.weatherUrl}/locations?query=${term}`,
            []
        );
    }

    findForecastByLocation(
        location: string,
        days: string,
        lang: string
    ): Promise<Forecast> {
        return this.getPromise<Forecast>(
            `${environment.apiUrl}/${environment.weatherUrl}`,
            undefined,
            new HttpParams({ fromObject: { location, days, lang } })
        );
    }
}
