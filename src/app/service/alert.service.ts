import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {Alert} from '@model/alert/alert';
import {plainToInstance} from 'class-transformer';
import {ToastService} from './toast.service';
import {UtilsService} from './utils.service';
import {ConfigurationService} from './configuration.service';
import {CreateAlert} from '@model/alert/create-alert';
import {Page} from '@model/http/page';
import {PageRequest} from '@model/http/page-request';

@Injectable({
  providedIn: 'root',
})
export class AlertService extends UtilsService {
  constructor(
    protected override httpClient: HttpClient,
    protected override toast: ToastService,
    protected configurationService: ConfigurationService
  ) {
    super(httpClient, toast);
    this.baseUrl = configurationService.get().apiUrl;
    this.apiUrl = configurationService.get().alertUrl;
  }

  getAllByUser(pageRequest?: PageRequest<Alert>): Observable<Page<Alert>> {
    return this.getPaged<Page<Alert>, Alert>({pageRequest}).pipe(
      map((alerts: Page<Alert>) => {
        alerts.content = plainToInstance(Alert, alerts.content);
        return alerts;
      })
    );
  }

  getById(id: string): Observable<Alert> {
    return this.get<Alert>({url: id}).pipe(
      map((alerts: unknown) => plainToInstance(Alert, alerts))
    );
  }

  create(alert: CreateAlert): Observable<boolean> {
    return this.post<void>({body: plainToInstance(CreateAlert, alert)}).pipe(
      map(response => response.ok)
    );
  }

  update(alert: CreateAlert): Observable<boolean> {
    return this.put<void>({body: plainToInstance(CreateAlert, alert)}).pipe(
      map(response => response.ok)
    );
  }

  deleteBydIds(ids: number[]): Observable<void> {
    return this.delete({url: `?ids=${ids}`}).pipe(
      tap(() => this.toast.info('alert.deleted', {size: ids.length}))
    );
  }
}
