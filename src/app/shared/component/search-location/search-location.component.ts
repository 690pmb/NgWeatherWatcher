import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { faLocationArrow } from '@fortawesome/free-solid-svg-icons';

import { WeatherService } from '../../service/weather.service';
import { Location } from '../../../model/location';
import { Observable, Observer } from 'rxjs';

@Component({
  selector: 'app-search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent {
  @Input()
  placeholder: string;
  @ViewChild(MatAutocompleteTrigger)
  trigger: MatAutocompleteTrigger;
  @Output()
  selected = new EventEmitter<string>();
  locations: Location[] = [];
  faLocationArrow = faLocationArrow;

  constructor(
    private weatherService: WeatherService
  ) { }

  search(term: string, encode: boolean): void {
    this.weatherService.search(term, encode).subscribe(locations => {
      this.locations = locations;
      this.trigger.openPanel();
    });
  }

  select(location: string): void {
    this.selected.emit(location);
  }

  geolocation(): void {
    new Observable((observer: Observer<string>) => WeatherService.findUserPosition(observer))
      .subscribe(location => this.search(location, false), err => this.weatherService.handleError(err));
  }

}
