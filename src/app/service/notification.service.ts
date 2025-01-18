import {Injectable} from '@angular/core';
import {SwPush} from '@angular/service-worker';
import {from, throwError, EMPTY, Observable} from 'rxjs';
import {catchError, switchMap, filter, tap} from 'rxjs/operators';
import {GobalError, UtilsService} from './utils.service';
import {HttpClient} from '@angular/common/http';
import {ToastService} from './toast.service';
import {ConfigurationService} from './configuration.service';
import {Subscription} from '@model/subscription';

@Injectable({
  providedIn: 'root',
})
export class NotificationService extends UtilsService {
  readonly VAPID_PUBLIC_KEY =
    'BIHunVcdZT4LiBzi4z4NEaMwp-YvBtyob7k0XsA6l_B-DKk59nkmplZUvU3Uiqvo23NARtyGQ2w19FWxNx_PJq8';

  constructor(
    private swPush: SwPush,
    protected override httpClient: HttpClient,
    protected override toast: ToastService,
    protected configurationService: ConfigurationService,
  ) {
    super(httpClient, toast);
    this.baseUrl = configurationService.get().apiUrl;
    this.apiUrl = configurationService.get().notificationUrl;
  }

  subscribeToNotifications(): void {
    if ('Notification' in window) {
      from(Notification.requestPermission())
        .pipe(
          filter(permission => permission === 'granted'),
          switchMap(() =>
            from(
              this.swPush.requestSubscription({
                serverPublicKey: this.VAPID_PUBLIC_KEY,
              }),
            ),
          ),
          switchMap(push => {
            const key = push.getKey ? push.getKey('p256dh') : '';
            const auth = push.getKey ? push.getKey('auth') : '';
            if (key && auth) {
              return this.post<Subscription>({
                url: 'subscriptions',
                body: {
                  endpoint: push.endpoint,
                  publicKey: btoa(
                    String.fromCharCode.apply(null, [...new Uint8Array(key)]),
                  ),
                  privateKey: btoa(
                    String.fromCharCode.apply(null, [...new Uint8Array(auth)]),
                  ),
                  userAgent: window.navigator.userAgent,
                } as Subscription,
              });
            } else {
              return EMPTY;
            }
          }),
          catchError((err: GobalError) => {
            this.toast.error('notification.error', {
              err: NotificationService.getErrorMessage(err),
            });
            return throwError(err);
          }),
        )
        .subscribe(response => {
          if (!response.ok) {
            this.toast.error('notification.error');
          }
        });
    } else {
      this.toast.warning('notification.not-supported');
    }
  }

  deleteOthers(): Observable<void> {
    return this.delete({
      url: 'subscriptions',
      body: {userAgent: window.navigator.userAgent},
    }).pipe(tap(() => this.toast.success('notification.unsubscribed')));
  }
}
