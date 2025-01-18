import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnChanges,
  booleanAttribute,
} from '@angular/core';
import {FormControl, ReactiveFormsModule} from '@angular/forms';
import {
  MatAutocompleteModule,
  MatAutocompleteTrigger,
} from '@angular/material/autocomplete';
import {faLocationArrow, faTimes} from '@fortawesome/free-solid-svg-icons';
import {iif, Observable, Observer, of} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  catchError,
  mergeMap,
  switchMap,
} from 'rxjs/operators';
import {Location} from '@model/weather/location';
import {WeatherService} from '@services/weather.service';
import {Utils} from '../../utils';
import {GobalError} from '@services/utils.service';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {TranslatePipe} from '@ngx-translate/core';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
  imports: [
    FontAwesomeModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatInputModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
    TranslatePipe,
  ],
  standalone: true,
})
export class SearchLocationComponent implements OnInit, OnChanges {
  @Input()
  placeholder?: string;

  @Input({transform: booleanAttribute})
  showPlaceholder = true;

  @Input()
  inputCtrl = new FormControl<string>('', {
    nonNullable: true,
  });

  @Output()
  selected = new EventEmitter<string>();

  @ViewChild(MatAutocompleteTrigger)
  trigger!: MatAutocompleteTrigger;

  locations: Location[] = [];
  initialPlaceholder?: string;
  showSpinner = false;
  faLocationArrow = faLocationArrow;
  faTimes = faTimes;

  constructor(private weatherService: WeatherService) {}

  ngOnChanges(): void {
    this.placeholder ||= 'global.none';
  }

  ngOnInit(): void {
    this.initialPlaceholder = this.placeholder;
    this.inputCtrl.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        mergeMap(term =>
          iif(
            () => Utils.isNotBlank(term),
            this.weatherService.search(term ?? ''),
            of([])
          )
        ),
        catchError((error: GobalError) => {
          this.weatherService.handleError(error);
          this.trigger.closePanel();
          return of([]);
        })
      )
      .subscribe(locations => (this.locations = locations));
  }

  geolocation(): void {
    this.showSpinner = true;
    new Observable((observer: Observer<string>) =>
      WeatherService.findUserPosition(observer)
    )
      .pipe(switchMap(location => this.weatherService.search(location)))
      .subscribe(locations => {
        this.showSpinner = false;
        this.locations = locations;
        this.trigger.openPanel();
      });
  }

  select(location: string): void {
    this.inputCtrl.disable();
    this.selected.emit(location);
    setTimeout(() => this.inputCtrl.enable(), 0);
    this.placeholder = location;
  }

  reset(): void {
    this.inputCtrl.reset();
    this.trigger.closePanel();
    this.selected.emit('');
    this.placeholder = this.initialPlaceholder ?? 'global.none';
  }
}
