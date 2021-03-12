import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { environment } from '../../../environments/environment';
import { Location } from '../../model/location';
import { Forecast } from '../../model/forecast';

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
      `${environment.apiUrl}/${environment.weatherUrl}/locations?query=${UtilsService.encodeQueryUrl(term)}`, []);
  }

  findForecastByLocation(location: string, days: string, lang: string): Promise<Forecast> {
    return this.getPromise<Forecast>(
      `${environment.apiUrl}/${environment.weatherUrl}`, undefined,
      new HttpParams({ fromObject: { location: location, days, lang } }));
  }
}
