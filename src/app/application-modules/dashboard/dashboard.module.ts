import {NgModule} from '@angular/core';
import {MatLegacyPaginatorModule as MatPaginatorModule} from '@angular/material/legacy-paginator';
import {MatLegacyProgressSpinnerModule as MatProgressSpinnerModule} from '@angular/material/legacy-progress-spinner';
import {MatLegacySlideToggleModule as MatSlideToggleModule} from '@angular/material/legacy-slide-toggle';
import {MatLegacyTableModule as MatTableModule} from '@angular/material/legacy-table';
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
    MatProgressSpinnerModule,
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule.forChild(),
    RouterModule.forChild(childRoutes),
  ],
})
export class DashboardModule {}
