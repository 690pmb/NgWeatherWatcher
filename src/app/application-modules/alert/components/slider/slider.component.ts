import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnChanges,
  SimpleChanges,
  ViewChild,
  OnInit,
} from '@angular/core';
import {MultipleData} from '../../model/multiple-data';
import {FormControl, FormsModule} from '@angular/forms';
import {SliderConfig, SliderValue} from '../../model/slider';
import {SliderFormatter} from '../../model/slider-formatter';
import {NouisliderComponent} from 'ng2-nouislider';

type Slider = {
  setHandle(index: number, value: number): void;
  enable(index: number): void;
  disable(index: number): void;
};

@Component({
  selector: 'app-slider',
  templateUrl: './slider.component.html',
  styleUrls: ['./slider.component.scss'],
  standalone: true,
  imports: [NouisliderComponent, FormsModule],
})
export class SliderComponent<T extends boolean>
  implements OnInit, OnChanges, MultipleData<SliderValue<T>, T>
{
  @Input({required: true})
  configuration!: SliderConfig<T>;

  @Input()
  initialValue?: SliderValue<T>;

  @Output()
  selected = new EventEmitter<SliderValue<T>>();

  @ViewChild('slider')
  slider?: NouisliderComponent;

  shownAddBtn = new EventEmitter<boolean>();
  shownDeleteBtn = new EventEmitter<boolean>();
  ctrl!: FormControl<SliderValue<T>>;
  tooltips!: boolean[] | boolean;
  SliderFormatter = SliderFormatter;
  config = {};
  mean!: number;

  ngOnChanges(changes: SimpleChanges): void {
    if (this.slider) {
      if (!changes['initialValue']?.currentValue.value) {
        this.initialValue = undefined;
        this.initValue();
      }
    }
  }

  ngOnInit(): void {
    if (!this.initialValue?.value) {
      this.shownAddBtn.emit(true);
    }
    this.config = {
      pips: {...this.configuration.pips, stepped: true},
      range: {
        min: [this.configuration.min],
        max: [this.configuration.max],
      },
    };
    this.tooltips = this.configuration.multiple ? [true, true] : true;
    this.initValue();
  }

  private initValue(): void {
    this.mean = Math.floor(
      (this.configuration.min + this.configuration.max) / 2,
    );
    if (!this.configuration.multiple) {
      this.configuration.value = this.mean;
    } else if (Array.isArray(this.initialValue?.value)) {
      this.configuration.value = [
        this.configuration.min,
        this.configuration.max,
      ];
      setTimeout(() => {
        if (Array.isArray(this.initialValue?.value)) {
          this.disable(
            {
              min: this.initialValue.value[0] !== null,
              max: this.initialValue.value[1] !== null,
            },
            true,
          );
        }
      }, 100);
    } else if (!this.initialValue?.value) {
      this.configuration.value = this.prettyInitValues();
    }
    setTimeout(() => this.select(this.configuration.value));
  }

  select(event?: (number | null)[] | number): void {
    this.configuration.value = event;
    this.selected.emit({
      value: event,
      multiple: Array.isArray(event),
    } as SliderValue<T>);
  }

  // eslint-disable-next-line complexity
  disable({min, max}: {min?: boolean; max?: boolean}, init = false): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const slider: Slider = this.slider?.slider;

    this.configuration.value ??= [
      this.configuration.min,
      this.configuration.max,
    ];

    if (this.configuration.multiple && slider) {
      if (max === false || min === false) {
        // Something is disabled
        const disabledIndex = max === false ? 1 : 0;

        // ENABLE
        this.enable(init, disabledIndex, slider);

        // DISABLE
        const disabledValue =
          min === false ? this.configuration.min : this.configuration.max;
        this.configuration.value[disabledIndex] = disabledValue;
        slider.setHandle(disabledIndex, disabledValue);
        slider.disable(disabledIndex);
      } else {
        // All is enabled
        slider.enable(0);
        slider.enable(1);
        if (min === undefined || max === undefined) {
          const idx = min === undefined ? 1 : 0;
          this.configuration.value[idx] = this.prettyInitValues()[idx] ?? 0;
          slider.setHandle(idx, this.configuration.value[idx]);
        } else {
          this.configuration.value = Array.isArray(this.initialValue?.value)
            ? this.initialValue?.value
            : this.prettyInitValues();
        }
      }
      this.select(this.configuration.value);
    }
  }

  private enable(init: boolean, disabledIndex: number, slider: Slider) {
    if (init) {
      const enabledIndex = 1 - disabledIndex;
      const enabledValue =
        (Array.isArray(this.initialValue?.value)
          ? this.initialValue?.value[enabledIndex]
          : this.configuration.value[enabledIndex]) ?? 0;
      this.configuration.value[enabledIndex] = enabledValue ?? 0;
      slider.setHandle(enabledIndex, enabledValue);
      slider.enable(enabledIndex);
    }
  }

  prettyInitValues(): [number, number] {
    if (this.configuration.step && this.configuration.step !== 1) {
      return [this.mean, this.mean + 2 * this.configuration.step];
    } else {
      return [
        Math.round((this.configuration.min + this.configuration.max) * 0.375),
        Math.round((this.configuration.min + this.configuration.max) * 0.625),
      ];
    }
  }
}
