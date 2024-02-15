import {HttpClient, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Forecast} from '@model/weather/forecast';
import {Location} from '@model/weather/location';
import {ToastService} from './toast.service';
import {UtilsService} from './utils.service';
import {ConfigurationService} from './configuration.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService extends UtilsService {
  constructor(
    protected override httpClient: HttpClient,
    protected override toast: ToastService,
    protected configurationService: ConfigurationService
  ) {
    super(httpClient, toast);
    this.baseUrl = configurationService.get().apiUrl;
    this.apiUrl = configurationService.get().weatherUrl;
  }

  search(term: string): Observable<Location[]> {
    return this.get<Location[]>({url: `locations?query=${term}`});
  }

  findForecastByLocation(
    location: string,
    days: string,
    lang: string
  ): Observable<Forecast> {
    return this.get<Forecast>({
      params: new HttpParams({fromObject: {location, days, lang}}),
    });
  }
}
