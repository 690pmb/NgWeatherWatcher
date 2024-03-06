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

@NgModule({
  declarations: [
    SearchLocationComponent,
    MenuComponent,
    IconPipe,
    DateTimePipe,
    TableExpandComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    MatListModule,
    MatToolbarModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatAutocompleteModule,
    MatSidenavModule,
    MatInputModule,
    MatDividerModule,
    RouterModule.forChild([]),
  ],
  exports: [
    TranslateModule,
    MatTableModule,
    TableExpandComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    IconPipe,
    DateTimePipe,
    MatDividerModule,
    MatSnackBarModule,
    SearchLocationComponent,
    FontAwesomeModule,
    MenuComponent,
  ],
})
export class SharedModule {
  constructor() {}
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
