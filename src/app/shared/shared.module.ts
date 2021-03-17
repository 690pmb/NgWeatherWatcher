import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './service/auth.service';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpClientModule } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatListModule } from '@angular/material/list';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SearchLocationComponent } from './component/search-location/search-location.component';
import { ToastService } from './service/toast.service';
import { WeatherService } from './service/weather.service';
import { MenuComponent } from './component/menu/menu.component';

@NgModule({
    declarations: [SearchLocationComponent, MenuComponent],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        HttpClientModule,
        FontAwesomeModule,
        MatListModule,
        MatButtonModule,
        MatSnackBarModule,
        MatAutocompleteModule,
        MatSidenavModule,
        MatInputModule,
        MatTooltipModule,
        RouterModule.forChild([])
    ],
    exports: [
        TranslateModule,
        CommonModule,
        FormsModule,
        MatButtonModule,
        MatSnackBarModule,
        SearchLocationComponent,
        MenuComponent
    ]
})
export class SharedModule {
    constructor() {}
    static forRoot(): ModuleWithProviders<SharedModule> {
        return {
            ngModule: SharedModule,
            providers: [AuthService, ToastService, WeatherService]
        };
    }
    static forChild(): ModuleWithProviders<SharedModule> {
        return { ngModule: SharedModule };
    }
}

export { AuthService } from './service/auth.service';
export { WeatherService } from './service/weather.service';
export { ToastService } from './service/toast.service';
