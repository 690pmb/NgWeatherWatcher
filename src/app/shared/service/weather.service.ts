import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastService } from './toast.service';
import { UtilsService } from './utils.service';
import { environment } from '../../../environments/environment';
import { Location } from '../../model/location';

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
}
