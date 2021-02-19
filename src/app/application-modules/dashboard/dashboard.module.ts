import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from '../../shared/shared.module';

const childRoutes: Routes = [
  {
    path: '', component: DashboardComponent
  },
];

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    SharedModule.forChild(),
    RouterModule.forChild(childRoutes),
  ]
})
export class DashboardModule { }
