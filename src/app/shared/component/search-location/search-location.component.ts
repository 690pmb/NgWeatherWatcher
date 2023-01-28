import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  OnChanges,
} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {faLocationArrow, faTimes} from '@fortawesome/free-solid-svg-icons';
import {iif, Observable, Observer, of} from 'rxjs';
import {
  debounceTime,
  distinctUntilChanged,
  catchError,
  mergeMap,
  switchMap,
} from 'rxjs/operators';
import {Location} from '../../../model/weather/location';
import {WeatherService} from '../../../service/weather.service';
import {Utils} from '../../utils';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent implements OnInit, OnChanges {
  @Input()
  placeholder?: string;

  @Input()
  showPlaceholder = true;

  @Input()
  inputCtrl?: FormControl<string>;

  @Output()
  selected = new EventEmitter<string>();

  @ViewChild(MatAutocompleteTrigger)
  trigger!: MatAutocompleteTrigger;

  locations: Location[] = [];
  initialPlaceholder?: string;
  faLocationArrow = faLocationArrow;
  faTimes = faTimes;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.initialPlaceholder = this.placeholder;
    if (!this.inputCtrl) {
      this.inputCtrl = new FormControl('', {
        nonNullable: true,
      });
    }
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
        catchError(error => {
          this.weatherService.handleError(error);
          this.trigger.closePanel();
          return of([]);
        })
      )
      .subscribe(locations => (this.locations = locations));
  }

  ngOnChanges(): void {
    this.placeholder ||= 'global.none';
  }

  geolocation(): void {
    new Observable((observer: Observer<string>) =>
      WeatherService.findUserPosition(observer)
    )
      .pipe(switchMap(location => this.weatherService.search(location)))
      .subscribe(locations => {
        this.locations = locations;
        this.trigger.openPanel();
      });
  }

  select(location: string): void {
    this.inputCtrl?.disable();
    this.selected.emit(location);
    setTimeout(() => this.inputCtrl?.enable(), 0);
    this.placeholder = location;
  }

  reset(): void {
    this.inputCtrl?.reset();
    this.trigger.closePanel();
    this.selected.emit('');
    this.placeholder = this.initialPlaceholder || 'global.none';
  }
}
