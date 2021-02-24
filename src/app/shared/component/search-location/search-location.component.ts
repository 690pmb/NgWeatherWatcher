import { Component, Input, Output, ViewChild, EventEmitter } from '@angular/core';
import { MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { WeatherService } from '../../service/weather.service';
import { Location } from '../../../model/location';

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

  constructor(
    private weatherService: WeatherService
  ) { }

  search(term: string): void {
    this.weatherService.search(term).subscribe(locations => {
      this.locations = locations;
      this.trigger.openPanel();
    });
  }

  select(location: string): void {
    this.selected.emit(location);
  }

}
