import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
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
export class SearchLocationComponent implements OnInit {
  @Input()
  placeholder!: string;

  @Output()
  selected = new EventEmitter<string>();

  @ViewChild(MatAutocompleteTrigger)
  trigger!: MatAutocompleteTrigger;

  inputCtrl = new FormControl('');
  locations: Location[] = [];
  faLocationArrow = faLocationArrow;
  faTimes = faTimes;

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
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
}
