import {NgModule} from '@angular/core';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {RouterModule, Routes} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MyPaginator} from '../../shared/my-paginator';
import {SharedModule} from '../../shared/shared.module';
import {AlertListComponent} from './components/alert-list/alert-list.component';
import {SelectRowDirective} from './select-row.directive';
import {ClickOutsideDirective} from './click-outside.directive';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';

const childRoutes: Routes = [
  {
    path: '',
    component: AlertListComponent,
  },
];

@NgModule({
  declarations: [AlertListComponent, SelectRowDirective, ClickOutsideDirective],
  imports: [
    MatTableModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useFactory: (translate: TranslateService): MyPaginator =>
        new MyPaginator(translate, 'alert'),
      deps: [TranslateService],
    },
  ],
})
export class AlertModule {}
