import {
  Component,
  OnInit,
  TemplateRef,
  TrackByFunction,
  ViewChild,
} from '@angular/core';
import {
  ActivatedRoute,
  convertToParamMap,
  ParamMap,
  Router,
} from '@angular/router';
import {
  faCheck,
  faEdit,
  faEllipsisVertical,
  faPlusSquare,
  faSun,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Subject} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {AlertService} from '@services/alert.service';
import {MenuService} from '@services/menu.service';
import {Alert} from '@model/alert/alert';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import {TitleCasePipe} from '@angular/common';
import {DateTimePipe} from '@shared/pipe/date-time.pipe';
import {SortField} from '@model/sort';
import {SortDirection} from '@angular/material/sort';
import {PageRequest} from '@model/http/page-request';
import {MonitoredField} from '@model/alert/monitored-field';
import {DateTime} from 'luxon';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
})
export class AlertListComponent implements OnInit {
  @ViewChild('deleteButton')
  deleteButton!: TemplateRef<number>;

  formatFields: {[key: string]: (a: Alert) => string} = {
    trigger_day: a =>
      this.titleCasePipe.transform(
        this.formatField(a.getTriggerDays(this.translate.currentLang), false)
      ),
    trigger_hour: a => this.datePipe.transform(a.triggerHour, 'hour') as string,
    monitored_day: a =>
      this.titleCasePipe.transform(
        this.formatField(a.getMonitoredDays(), false)
      ),
    monitored_hour: a => this.formatField(a.monitoredHours, false),
    location: a => a.location,
  };

  queryParam = new Subject<ParamMap>();
  alerts$ = this.queryParam.pipe(
    switchMap(queryParam => {
      this.pageRequest.sortField = (queryParam.get('sortField') ??
        'location') as SortField<Alert>;
      this.pageRequest.sortDir =
        (queryParam.get('sortDir') as SortDirection) ?? 'asc';
      this.pageRequest.page = +(queryParam.get('page') ?? 0);
      return this.alertService.getAllByUser(this.pageRequest);
    })
  );

  pageRequest = new PageRequest<Alert>();
  faCheck = faCheck;
  faEdit = faEdit;
  faTrash = faTrash;
  faPlus = faPlusSquare;
  faMenu = faEllipsisVertical;
  faSun = faSun;
  selected: number[] = [];
  columnsToDisplay: (SortField<Alert> | 'edit')[] = [
    'triggerDays',
    'triggerHour',
    'monitoredHours',
    'location',
    'forceNotification',
    'edit',
  ];

  constructor(
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private menuService: MenuService,
    private bottomSheet: MatBottomSheet,
    private titleCasePipe: TitleCasePipe,
    private datePipe: DateTimePipe
  ) {}

  ngOnInit(): void {
    this.menuService.title$.next('alert.title');
    this.activatedRoute.queryParamMap.subscribe(q => this.queryParam.next(q));
  }

  navigate(
    page: number,
    sortField?: SortField<Alert>,
    sortDir?: SortDirection
  ): void {
    this.router
      .navigate(['.'], {
        queryParams: {page, sortField, sortDir},
        replaceUrl: true,
        relativeTo: this.activatedRoute,
      })
      .catch(err => console.error(err));
  }

  formatField(field: string[], handleEllips: boolean): string {
    let result = field;
    let ellips = '';
    if (handleEllips && result.length > 3) {
      result = result.slice(0, 2);
      ellips = '...';
    }
    return `${result.map(a => this.translate.instant(a)).join(', ')}${ellips}`;
  }

  handleSelection(id: number): void {
    this.selected.push(id);
    this.bottomSheet.open(this.deleteButton, {
      data: {selected: this.selected.length},
      hasBackdrop: false,
      closeOnNavigation: true,
      panelClass: 'delete-button',
    });
  }

  isRowSelected(id: number): boolean {
    return this.selected.includes(id);
  }

  delete(ids: number[]): void {
    this.alertService.deleteBydIds(ids).subscribe(() => {
      this.resetSelection();
      this.queryParam.next(
        convertToParamMap({
          page: 0,
          sortField: this.pageRequest.sortField,
          sortDir: this.pageRequest.sortDir,
        })
      );
    });
  }

  view(alert: Alert): void {
    this.router
      .navigate(
        [`/dashboard/details/${DateTime.now().toFormat('yyyy-MM-dd')}`],
        {
          queryParams: {alert: alert.id, location: alert.location},
        }
      )
      .catch(err => console.error(err));
  }

  resetSelection(): void {
    this.selected = [];
    this.bottomSheet.dismiss();
  }

  trackByFn: TrackByFunction<MonitoredField> = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
    item: MonitoredField
  ) => item.field;
}
