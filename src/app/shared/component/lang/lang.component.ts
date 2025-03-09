import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {DropDownChoice} from '@model/dropdown-choice';
import {MatSelect} from '@angular/material/select';
import {map, Observable} from 'rxjs';
import {WeatherService} from '@services/weather.service';
import {AsyncPipe, TitleCasePipe} from '@angular/common';

@Component({
  selector: 'app-lang',
  templateUrl: './lang.component.html',
  styleUrls: ['./lang.component.scss'],
  imports: [
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    AsyncPipe,
    MatInputModule,
    MatProgressSpinnerModule,
    MatSelect,
    ReactiveFormsModule,
    TitleCasePipe,
  ],
  standalone: true,
})
export class LangComponent {
  @Input()
  initValue!: string;

  @Output()
  selected = new EventEmitter<string>();

  static languageNames = new Intl.DisplayNames([navigator.language], {
    type: 'language',
  });

  availablesLangs$: Observable<DropDownChoice<string>[]> = inject(
    WeatherService,
  )
    .availableLangs()
    .pipe(
      map(langs =>
        langs
          .filter(l => !l.includes('_'))
          .map(l => ({
            value: l,
            key: LangComponent.languageNames.of(l) ?? '',
          }))
          .sort(),
      ),
    );
}
