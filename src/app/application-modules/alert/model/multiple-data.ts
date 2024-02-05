import {EventEmitter} from '@angular/core';
import {FormControl} from '@angular/forms';

export interface MultipleData<T, U> {
  shownAddBtn: EventEmitter<boolean>;
  shownDeleteBtn: EventEmitter<boolean>;
  ctrl?: FormControl<T>;
  configuration: U;
}
