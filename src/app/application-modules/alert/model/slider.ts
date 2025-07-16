import {NouiFormatter} from 'ng2-nouislider';
import {Pip} from './pip';

export type Slider = {
  min: number;
  max: number;
  fixedDragging?: number;
  formatter?: NouiFormatter;
  step?: number;
  pips?: Pip;
};
export type Value<T extends boolean, U> = {multiple: T; value?: U};
export type SliderValue<T extends boolean> = T extends true
  ? Value<true, (number | null)[]>
  : Value<false, number>;
export type SliderConfig<T extends boolean> = Slider & SliderValue<T>;
