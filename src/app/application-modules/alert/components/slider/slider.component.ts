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
import {SliderConfig} from '../../model/slider-config';
import {SliderType} from '../../model/slider-type';

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
})
export class SliderComponent
  implements OnInit, OnChanges, MultipleData<SliderType, SliderConfig>
{
  @Input()
  configuration!: SliderConfig;

  @Output()
  selected = new EventEmitter<SliderType>();

  shownAddBtn = new EventEmitter<boolean>();
  shownDeleteBtn = new EventEmitter<boolean>();
  ctrl!: FormControl<SliderType>;
  tooltips!: boolean | boolean[];
  config = {};

  constructor() {}

  ngOnInit() {
    this.shownAddBtn.emit(true);
    this.configuration.multiple = this.configuration.multiple ?? false;
    this.initValue();
    this.config = {
      pips: {...this.configuration.pips, stepped: true},
      range: {min: [this.configuration.min], max: [this.configuration.max]},
    };
    if (!this.configuration.formatter) {
      this.configuration.formatter = {
        to: (value: number): string => `${Math.round(value)}`,
        from: (value: string): number => +value,
      };
    }
    this.tooltips = this.configuration.multiple ? [true, true] : true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.configuration.currentValue.initValue) {
      this.configuration.initialValue = undefined;
      this.initValue();
    }
  }

  private initValue(): void {
    const mean = Math.floor(
      (this.configuration.min + this.configuration.max) / 2
    );
    if (!this.configuration.initialValue) {
      if (!this.configuration.multiple) {
        this.configuration.initialValue = mean;
      } else if (this.configuration.step && this.configuration.step !== 1) {
        this.configuration.initialValue = [
          mean,
          mean + 2 * this.configuration.step,
        ];
      } else {
        this.configuration.initialValue = [
          Math.round((this.configuration.min + this.configuration.max) * 0.375),
          Math.round((this.configuration.min + this.configuration.max) * 0.625),
        ];
      }
    }
    this.selected.emit(this.configuration.initialValue ?? 0);
  }
}
