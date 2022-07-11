import {Component, EventEmitter, Input, Output, ViewChild} from '@angular/core';
import {MatAutocompleteTrigger} from '@angular/material/autocomplete';
import {faLocationArrow, faTimes} from '@fortawesome/free-solid-svg-icons';
import {Observable, Observer} from 'rxjs';
import {Location} from '../../../model/weather/location';
import {WeatherService} from '../../service/weather.service';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss'],
})
export class SearchLocationComponent {
  @Input()
  placeholder!: string;

  @Output()
  selected = new EventEmitter<string>();

  @ViewChild(MatAutocompleteTrigger)
  trigger!: MatAutocompleteTrigger;

  locations: Location[] = [];
  faLocationArrow = faLocationArrow;
  faTimes = faTimes;

  constructor(private weatherService: WeatherService) {}

  search(term: string): void {
    this.weatherService.search(term).subscribe(locations => {
      this.locations = locations;
      this.trigger.openPanel();
    });
  }

  select(location: string): void {
    this.selected.emit(location);
  }

  geolocation(): void {
    new Observable((observer: Observer<string>) =>
      WeatherService.findUserPosition(observer)
    ).subscribe(
      location => this.search(location),
      err => this.weatherService.handleError(err)
    );
  }
}
