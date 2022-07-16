import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {faCheck, faEdit} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Utils} from '../../../../shared/utils';
import {AlertService} from '../../../../service/alert.service';
import {MenuService} from '../../../../service/menu.service';
import {Alert} from '../../../../model/alert/alert';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts!: Alert[];
  shownAlerts!: Alert[];
  pageIndex!: number;
  pageSize = 10;
  faCheck = faCheck;
  faEdit = faEdit;
  subs: Subscription[] = [];
  columnsToDisplay = [
    'trigger-day',
    'trigger-hour',
    'monitored-hour',
    'location',
    'force',
    'edit',
  ];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private menuService: MenuService
  ) {}

  ngOnInit(): void {
    this.menuService.title$.next('');
    this.subs.push(
      this.alertService.getAllByUser().subscribe(alerts => {
        this.alerts = alerts;
        this.subs.push(
          this.activatedRoute.queryParamMap
            .pipe(filter(q => q !== undefined))
            .subscribe(queryParam =>
              this.filterAndPaginate(
                +Utils.getOrElse(queryParam.get('page'), '0')
              )
            )
        );
      })
    );
  }

  filterAndPaginate(pageIndex: number): void {
    this.pageIndex = pageIndex;
    this.shownAlerts = this.alerts.slice(
      this.pageIndex * this.pageSize,
      (this.pageIndex + 1) * this.pageSize
    );
  }

  navigate(page: number): void {
    this.router
      .navigate(['.'], {
        queryParams: {page},
        replaceUrl: true,
      })
      .catch(err => console.error(err));
  }

  formatField(field: string[]): string {
    let result = field;
    let ellips = '';
    if (result.length > 3) {
      result = result.slice(0, 2);
      ellips = '...';
    }
    return `${result.map(a => this.translate.instant(a)).join(', ')}${ellips}`;
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
