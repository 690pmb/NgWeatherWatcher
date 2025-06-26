import {
  Directive,
  ElementRef,
  Input,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import {WeatherField} from '@model/alert/weather-field';
import {Hour} from '@model/weather/hour';
import {HighlightService} from '../services/highlight.service';
import {DateTime} from 'luxon';
import {BehaviorSubject, combineLatest, Subscription} from 'rxjs';

@Directive({
  selector: '[appHighlight]',
  standalone: true,
})
export class HighlightDirective implements OnInit, OnDestroy {
  @Input('appHighlight')
  set field(value: WeatherField | undefined) {
    this.field$.next(value);
  }

  @Input()
  set hour(value: Hour | undefined) {
    this.hour$.next(value);
  }

  private field$ = new BehaviorSubject<WeatherField | undefined>(undefined);
  private hour$ = new BehaviorSubject<Hour | undefined>(undefined);
  private subscription?: Subscription;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2,
    private highlightService: HighlightService,
  ) {}

  ngOnInit(): void {
    this.subscription = combineLatest([
      this.highlightService.alert$,
      this.hour$,
      this.field$,
    ]).subscribe(([alert, hour, field]) => {
      const shouldHighlight =
        hour &&
        field &&
        alert?.monitoredHours.includes(
          DateTime.fromFormat(hour.time, 'yyyy-MM-dd HH:mm').toFormat('HH:mm'),
        ) &&
        alert.monitoredFields.map(m => m.field).includes(field);
      if (shouldHighlight) {
        const mapWeatherMonitored = HighlightService.MAP_WEATHER_MONITORED.find(
          m => m.weatherField === field,
        );
        if (
          mapWeatherMonitored &&
          HighlightService.between(
            alert.monitoredFields,
            mapWeatherMonitored.value(hour),
            mapWeatherMonitored.weatherField,
          )
        ) {
          this.renderer.addClass(this.el.nativeElement, 'highlight');
        } else {
          this.renderer.removeClass(this.el.nativeElement, 'highlight');
        }
      } else {
        this.renderer.removeClass(this.el.nativeElement, 'highlight');
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
