import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    HttpClientModule
  ],
  exports: [
    TranslateModule,
    CommonModule,
    FormsModule,
  ]
})
export class SharedModule {
  constructor() { }
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [AuthService]
    };
  }
  static forChild(): ModuleWithProviders<SharedModule> {
    return { ngModule: SharedModule };
  }
}

export { AuthService } from './service/auth.service';
