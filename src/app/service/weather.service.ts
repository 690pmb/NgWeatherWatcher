import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Forecast} from '../model/weather/forecast';
import {Location} from '../model/weather/location';
import {ToastService} from './toast.service';
import {UtilsService} from './utils.service';
import {ConfigurationService} from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends UtilsService {
  constructor(
    protected httpClient: HttpClient,
    protected toast: ToastService,
    protected configurationService: ConfigurationService
  ) {
    super(
      httpClient,
      toast,
      configurationService.get().apiUrl,
      configurationService.get().weatherUrl
    );
  }

  search(term: string): Observable<Location[]> {
    return this.get<Location[]>(`locations?query=${term}`);
  }

  findForecastByLocation(
    location: string,
    days: string,
    lang: string
  ): Observable<Forecast> {
    return this.get<Forecast>(
      '',
      new HttpParams({fromObject: {location, days, lang}})
    );
  }
}
