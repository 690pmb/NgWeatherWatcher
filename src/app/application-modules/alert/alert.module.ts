import {NgModule} from '@angular/core';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {RouterModule, Routes} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MyPaginator} from '../../shared/my-paginator';
import {SharedModule} from '../../shared/shared.module';
import {AlertListComponent} from './components/alert-list/alert-list.component';
import {AlertService} from './service/alert.service';
import {SelectRowDirective} from './select-row.directive';

const childRoutes: Routes = [
  {
    path: '',
    component: AlertListComponent,
  },
];

@NgModule({
  declarations: [AlertListComponent, SelectRowDirective],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  providers: [
    AlertService,
    {
      provide: MatPaginatorIntl,
      useFactory: (translate: TranslateService): MyPaginator =>
        new MyPaginator(translate),
      deps: [TranslateService],
    },
  ],
})
export class AlertModule {}
