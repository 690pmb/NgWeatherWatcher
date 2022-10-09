import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {from, throwError} from 'rxjs';
import {catchError, switchMap} from 'rxjs/operators';
import {UtilsService} from './utils.service';
import {HttpClient} from '@angular/common/http';
import {ToastService} from './toast.service';
import {ConfigurationService} from './configuration.service';
import {Subscription} from '../model/subscription';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends UtilsService {
  readonly VAPID_PUBLIC_KEY =
    'BIHunVcdZT4LiBzi4z4NEaMwp-YvBtyob7k0XsA6l_B-DKk59nkmplZUvU3Uiqvo23NARtyGQ2w19FWxNx_PJq8';

  constructor(
    private swPush: SwPush,
    protected httpClient: HttpClient,
    protected toast: ToastService,
    protected configurationService: ConfigurationService
  ) {
    super(
      httpClient,
      toast,
      configurationService.get().apiUrl,
      configurationService.get().notificationUrl
    );
  }

  subscribeToNotifications(): void {
    from(
      this.swPush.requestSubscription({
        serverPublicKey: this.VAPID_PUBLIC_KEY,
      })
    )
      .pipe(
        switchMap(push =>
          this.post<Subscription>('subscriptions', {
            endpoint: push.endpoint,
            userAgent: window.navigator.userAgent,
          } as Subscription)
        ),
        catchError(err => {
          this.toast.error(
            `Could not subscribe to notifications: ${NotificationService.getErrorMessage(
              err
            )}`
          );
          return throwError(err);
        })
      )
      .subscribe();
  }
}
