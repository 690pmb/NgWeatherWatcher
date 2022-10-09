import {NouiFormatter} from 'ng2-nouislider';
import {Pip} from './pip';
import {SliderType} from './slider-type';

export interface SliderConfig {
  min: number;
  max: number;
  initialValue?: SliderType;
  multiple: boolean;
  fixedDragging?: number;
  formatter?: NouiFormatter;
  step?: number;
  pips?: Pip;
}
