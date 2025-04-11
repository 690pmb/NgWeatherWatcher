import {Component, EventEmitter, inject, Input, Output} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {DropDownChoice} from '@model/dropdown-choice';
import {MatSelect} from '@angular/material/select';
import {map, Observable, combineLatest} from 'rxjs';
import {WeatherService} from '@services/weather.service';
import {AsyncPipe, TitleCasePipe} from '@angular/common';
import {LangService} from '@services/lang.service';

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

  readonly languageNames$ = inject(LangService)
    .getLang()
    .pipe(
      map(
        l =>
          new Intl.DisplayNames([l], {
            type: 'language',
          }),
      ),
    );

  availablesLangs$: Observable<DropDownChoice<string>[]> = combineLatest([
    inject(WeatherService).availableLangs(),
    this.languageNames$,
  ]).pipe(
    map(([availableLangs, languageNames]) =>
      availableLangs
        .filter(l => !l.includes('_'))
        .map(l => ({
          value: l,
          key: languageNames.of(l) ?? '',
        }))
        .sort((l1, l2) => l1.key.localeCompare(l2.key)),
    ),
  );
}
