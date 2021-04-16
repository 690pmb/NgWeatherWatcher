import {NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from '../../shared/shared.module';
import {AlertService} from './service/alert.service';

@NgModule({
  declarations: [],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule.forChild(),
  ],
  providers: [AlertService],
})
export class AlertModule {}
