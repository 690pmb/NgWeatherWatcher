import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';
import {SliderConfig} from './slider';

export type MultipleData<T, U extends boolean> = {
  shownAddBtn: EventEmitter<boolean>;
  shownDeleteBtn: EventEmitter<boolean>;
  selected: EventEmitter<T>;
  ctrl: FormControl<T>;
  initialValue?: T;
  configuration: SliderConfig<U>;
};
