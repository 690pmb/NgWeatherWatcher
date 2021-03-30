import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ModuleWithProviders, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TranslateModule } from '@ngx-translate/core';
import { MenuComponent } from './component/menu/menu.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { SearchLocationComponent } from './component/search-location/search-location.component';
import { IconPipe } from './pipe/icon.pipe';
import { AuthService } from './service/auth.service';
import { ToastService } from './service/toast.service';
import { WeatherService } from './service/weather.service';

@NgModule({
    declarations: [SearchLocationComponent, MenuComponent, IconPipe],
    imports: [
        CommonModule,
        FormsModule,
        TranslateModule,
        HttpClientModule,
        FontAwesomeModule,
        MatListModule,
        MatToolbarModule,
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
        IconPipe,
        MatSnackBarModule,
        SearchLocationComponent,
        MenuComponent
    ],
    providers: [DatePipe]
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
export { ToastService } from './service/toast.service';
export { WeatherService } from './service/weather.service';
export { MenuService } from './service/menu.service';
