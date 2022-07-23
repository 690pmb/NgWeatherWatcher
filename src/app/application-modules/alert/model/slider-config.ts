import {SliderType} from './slider-type';
import {NouiFormatter} from 'ng2-nouislider';
import {Pip} from './pip';

export type SliderConfig = {
  min: number;
  max: number;
  multiple: boolean;
  initialValue?: SliderType;
  fixedDragging?: number;
  formatter?: NouiFormatter;
  step?: number;
  pips?: Pip;
};
