import { NgModule } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { DashboardForecastComponent } from './components/dashboard-forecast/dashboard-forecast.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

const childRoutes: Routes = [
    {
        path: '',
        component: DashboardForecastComponent
    }
];

@NgModule({
    declarations: [DashboardComponent, DashboardForecastComponent],
    imports: [
        MatProgressSpinnerModule,
        MatDividerModule,
        SharedModule.forChild(),
        RouterModule.forChild(childRoutes)
    ]
})
export class DashboardModule { }
