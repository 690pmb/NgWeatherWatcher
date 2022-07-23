import {animate, state, style, transition, trigger} from '@angular/animations';
import {
  Component,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {faCheck, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import {TranslateService} from '@ngx-translate/core';
import {Subscription} from 'rxjs';
import {filter} from 'rxjs/operators';
import {Utils} from '../../../../shared/utils';
import {AlertService} from '../../../../service/alert.service';
import {MenuService} from '../../../../service/menu.service';
import {Alert} from '../../../../model/alert/alert';
import {MatBottomSheet} from '@angular/material/bottom-sheet';

@Component({
  selector: 'app-alert-list',
  templateUrl: './alert-list.component.html',
  styleUrls: ['./alert-list.component.scss'],
  animations: [
    trigger('detailExpand', [
      state(
        'collapsed',
        style({height: '0px', minHeight: '0', display: 'none'})
      ),
      state('expanded', style({height: '*'})),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AlertListComponent implements OnInit, OnDestroy {
  alerts!: Alert[];
  shownAlerts!: Alert[];
  pageIndex!: number;
  pageSize = 10;
  faCheck = faCheck;
  faEdit = faEdit;
  faTrash = faTrash;
  subs: Subscription[] = [];
  expandedAlert?: Alert;
  selected: number[] = [];
  expandedColumn = 'details';
  columnsToDisplay = [
    'trigger-day',
    'trigger-hour',
    'monitored-hour',
    'location',
    'force',
    'edit',
  ];

  @ViewChild('deleteButton')
  deleteButton!: TemplateRef<number>;

  constructor(
    private router: Router,
    private alertService: AlertService,
    private activatedRoute: ActivatedRoute,
    public translate: TranslateService,
    private menuService: MenuService,
    private bottomSheet: MatBottomSheet
  ) {}

  ngOnInit(): void {
    this.menuService.title$.next('alert.title');
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

  formatField(field: string[], handleEllips: boolean): string {
    let result = field;
    let ellips = '';
    if (handleEllips && result.length > 3) {
      result = result.slice(0, 2);
      ellips = '...';
    }
    return `${result.map(a => this.translate.instant(a)).join(', ')}${ellips}`;
  }

  expand(alert: Alert): void {
    this.expandedAlert = this.expandedAlert === alert ? undefined : alert;
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

  delete(): void {
    this.alertService.deleteBydIds(this.selected).subscribe(() => {
      this.alerts = this.alerts.filter(a => !this.selected.includes(a.id));
      this.resetSelection();
      this.filterAndPaginate(0);
    });
  }

  resetSelection(): void {
    this.selected = [];
    this.bottomSheet.dismiss();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }
}
