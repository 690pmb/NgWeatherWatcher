import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ToastService } from './service/toast.service';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HttpClientModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class SharedModule {
  constructor() { }
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        AuthService,
        ToastService
      ]
    };
  }
  static forChild(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule };
  }
}

export { AuthService } from './service/auth.service';
