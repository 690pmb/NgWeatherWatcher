import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Alert} from '../model/alert/alert';
import {plainToInstance} from 'class-transformer';
import {ToastService} from './toast.service';
import {UtilsService} from './utils.service';
import {ConfigurationService} from './configuration.service';
import {CreateAlert} from '../model/alert/create-alert';

@Injectable({
  providedIn: 'root',
})
export class AlertService extends UtilsService {
  constructor(
    protected httpClient: HttpClient,
    protected toast: ToastService,
    protected configurationService: ConfigurationService
  ) {
    super(httpClient, toast);
    this.baseUrl = configurationService.get().apiUrl;
    this.apiUrl = configurationService.get().weatherUrl;
  }

  getAllByUser(): Observable<Alert[]> {
    return this.get<Alert[]>().pipe(
      map((alerts: Object[]) => plainToInstance(Alert, alerts))
    );
  }

  getById(id: string): Observable<Alert> {
    return this.get<Alert>(id).pipe(
      map((alerts: Object) => plainToInstance(Alert, alerts))
    );
  }

  create(alert: CreateAlert): Observable<boolean> {
    return this.post<void>('', plainToInstance(CreateAlert, alert)).pipe(
      map(response => response.ok)
    );
  }

  update(alert: CreateAlert): Observable<boolean> {
    return this.put<void>('', plainToInstance(CreateAlert, alert)).pipe(
      map(response => response.ok)
    );
  }

  deleteBydIds(ids: number[]): Observable<void> {
    return this.delete(`?ids=${ids}`).pipe(
      tap(() => this.toast.info('alert.deleted', {size: ids.length}))
    );
  }
}
