import {NgModule} from '@angular/core';
import {
  MatPaginatorIntl,
  MatPaginatorModule,
} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {RouterModule, Routes} from '@angular/router';
import {TranslateService} from '@ngx-translate/core';
import {MatBadgeModule} from '@angular/material/badge';
import {MyPaginator} from '../../shared/my-paginator';
import {SharedModule} from '../../shared/shared.module';
import {AlertListComponent} from './components/alert-list/alert-list.component';
import {SelectRowDirective} from './select-row.directive';
import {ClickOutsideDirective} from './click-outside.directive';
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {AlertComponent} from './components/alert/alert.component';
import {QuestionComponent} from './components/question/question.component';
import {MatMenuModule} from '@angular/material/menu';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NouisliderModule} from 'ng2-nouislider';
import {SliderComponent} from './components/slider/slider.component';
import {MatSelectModule} from '@angular/material/select';
import {SelectWeatherFieldComponent} from './components/select-weather-field/select-weather-field.component';
import {AlertWeatherFieldComponent} from './components/alert-weather-field/alert-weather-field.component';
import {MultipleComponent} from './components/multiple/multiple.component';
import {ContainerDirective} from './components/multiple/container.directive';
import {ReactiveFormsModule} from '@angular/forms';
import {TitleCasePipe} from '@angular/common';
import {MatSortModule} from '@angular/material/sort';

const childRoutes: Routes = [
  {
    path: '',
    component: AlertListComponent,
  },
  {
    path: 'create',
    component: AlertComponent,
  },
  {
    path: 'edit/:id',
    component: AlertComponent,
  },
];

@NgModule({
  declarations: [
    AlertListComponent,
    AlertComponent,
    AlertWeatherFieldComponent,
    QuestionComponent,
    MultipleComponent,
    SliderComponent,
    SelectWeatherFieldComponent,
    SelectRowDirective,
    ClickOutsideDirective,
    ContainerDirective,
  ],
  imports: [
    MatBadgeModule,
    MatCheckboxModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatMenuModule,
    MatSortModule,
    MatBottomSheetModule,
    MatPaginatorModule,
    NouisliderModule,
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
    TitleCasePipe,
  ],
})
export class AlertModule {}
