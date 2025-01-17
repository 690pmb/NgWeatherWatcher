import {Directive, ElementRef, Input, OnInit, Renderer2} from '@angular/core';
import {WeatherField} from '@model/alert/weather-field';
import {Hour} from '@model/weather/hour';
import {HighlightService} from '../services/highlight.service';
import {DateTime} from 'luxon';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit {
  @Input('appHighlight')
  field?: WeatherField;

  @Input()
  hour?: Hour;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private highlightService: HighlightService
  ) {}

  ngOnInit(): void {
    this.highlightService.alert$.subscribe(alert => {
      if (
        this.hour &&
        this.field &&
        alert?.monitoredHours.includes(
          DateTime.fromFormat(this.hour.time, 'yyyy-MM-dd HH:mm').toFormat(
            'HH:mm'
          )
        ) &&
        alert.monitoredFields.map(m => m.field).includes(this.field)
      ) {
        const mapWeatherMonitored = HighlightService.MAP_WEATHER_MONITORED.find(
          m => m.weatherField === this.field
        );
        if (
          mapWeatherMonitored &&
          HighlightService.between(
            alert.monitoredFields,
            mapWeatherMonitored.value(this.hour),
            mapWeatherMonitored.weatherField
          )
        ) {
          this.renderer.addClass(this.el.nativeElement, 'highlight');
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'highlight');
        }
      }
    });
  }
}
