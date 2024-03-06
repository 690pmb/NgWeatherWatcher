import {Component, Input} from '@angular/core';
import {FormControl, FormArray} from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent<T> {
  @Input()
  label?: string;

  @Input()
  ctrl?: FormArray | FormControl<T>;
}
