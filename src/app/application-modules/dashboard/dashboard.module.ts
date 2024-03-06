import {NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '@shared/shared.module';
import {DashboardDetailsComponent} from './components/dashboard-details/dashboard-details.component';
import {DashboardForecastComponent} from './components/dashboard-forecast/dashboard-forecast.component';
import {DashboardComponent} from './components/dashboard/dashboard.component';
import {HighlightDirective} from './directives/highlight.directive';

const childRoutes: Routes = [
  {
    path: '',
    component: DashboardForecastComponent,
  },
  {
    path: 'details/:date',
    component: DashboardDetailsComponent,
  },
];

@NgModule({
  declarations: [
    DashboardComponent,
    DashboardDetailsComponent,
    DashboardForecastComponent,
    HighlightDirective,
  ],
  imports: [
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSlideToggleModule,
    MatTableModule,
    SharedModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
})
export class DashboardModule {}
