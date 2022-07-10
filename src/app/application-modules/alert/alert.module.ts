import {NgModule} from '@angular/core';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatTableModule} from '@angular/material/table';
import {SharedModule} from '../../shared/shared.module';

@NgModule({
  declarations: [],
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatSlideToggleModule,
    SharedModule.forChild(),
  ],
  providers: [],
})
export class AlertModule {}
