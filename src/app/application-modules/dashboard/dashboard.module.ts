import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';

import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
    {
        path: '',
        component: DashboardComponent
    }
];

@NgModule({
    declarations: [DashboardComponent],
    imports: [
        MatProgressSpinnerModule,
        MatDividerModule,
        SharedModule.forChild(),
        RouterModule.forChild(childRoutes)
    ]
})
export class DashboardModule {}
