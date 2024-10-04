import {CommonModule} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatButtonModule} from '@angular/material/button';
import {MatDividerModule} from '@angular/material/divider';
import {MatInputModule} from '@angular/material/input';
import {MatListModule} from '@angular/material/list';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {RouterModule} from '@angular/router';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {TranslateModule} from '@ngx-translate/core';
import {MenuComponent} from './component/menu/menu.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {SearchLocationComponent} from './component/search-location/search-location.component';
import {IconPipe} from './pipe/icon.pipe';
import {DateTimePipe} from './pipe/date-time.pipe';
import {MatTableModule} from '@angular/material/table';
import {TableExpandComponent} from './component/table-expand/table-expand.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';

@NgModule({
  declarations: [
    DateTimePipe,
    IconPipe,
    MenuComponent,
    SearchLocationComponent,
    TableExpandComponent,
  ],
  exports: [
    CommonModule,
    DateTimePipe,
    FontAwesomeModule,
    FormsModule,
    IconPipe,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatTableModule,
    MenuComponent,
    SearchLocationComponent,
    TableExpandComponent,
    TranslateModule,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    FormsModule,
    HttpClientModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDividerModule,
    MatInputModule,
    MatListModule,
    MatProgressSpinnerModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatTableModule,
    MatToolbarModule,
    ReactiveFormsModule,
    TranslateModule,
    RouterModule.forChild([]),
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [IconPipe, DateTimePipe],
    };
  }

  static forChild(): ModuleWithProviders<SharedModule> {
    return {ngModule: SharedModule};
  }
}
