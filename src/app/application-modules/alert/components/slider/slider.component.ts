import {
  Component,
  Input,
  OnInit,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {MultipleData} from '../../model/multiple-data';
import {FormControl} from '@angular/forms';
import {SliderConfig, SliderValue} from '../../model/slider';
import {SliderFormatter} from '../../model/slider-formatter';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent<T extends boolean>
  implements OnInit, OnChanges, MultipleData<SliderValue<T>, T>
{
  @Input()
  configuration!: SliderConfig<T>;

  @Input()
  initialValue?: SliderValue<T>;

  @Output()
  selected = new EventEmitter<SliderValue<T>>();

  shownAddBtn = new EventEmitter<boolean>();
  shownDeleteBtn = new EventEmitter<boolean>();
  ctrl!: FormControl<SliderValue<T>>;
  tooltips!: boolean[] | boolean;
  SliderFormatter = SliderFormatter;
  config = {};

  ngOnInit() {
    if (!this.initialValue?.value) {
      this.shownAddBtn.emit(true);
    }
    this.initValue();
    this.config = {
      pips: {...this.configuration.pips, stepped: true},
      range: {min: [this.configuration.min], max: [this.configuration.max]},
    };
    this.tooltips = this.configuration.multiple ? [true, true] : true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['initialValue']?.currentValue.value) {
      this.initialValue = undefined;
      this.initValue();
    }
  }

  private initValue(): void {
    const mean = Math.floor(
      (this.configuration.min + this.configuration.max) / 2
    );
    if (!this.initialValue?.value) {
      if (!this.configuration.multiple) {
        this.configuration.value = mean;
      } else if (this.configuration.step && this.configuration.step !== 1) {
        this.configuration.value = [mean, mean + 2 * this.configuration.step];
      } else {
        this.configuration.value = [
          Math.round((this.configuration.min + this.configuration.max) * 0.375),
          Math.round((this.configuration.min + this.configuration.max) * 0.625),
        ];
      }
      setTimeout(() =>
        this.selected.emit({
          value: this.configuration.value,
          multiple: Array.isArray(this.configuration.value),
        } as SliderValue<T>)
      );
    } else {
      this.configuration.value = this.initialValue.value;
    }
  }

  select(event: number[] | number): void {
    this.selected.emit({
      value: event,
      multiple: Array.isArray(event),
    } as SliderValue<T>);
  }
}
