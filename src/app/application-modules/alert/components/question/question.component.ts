import {Component, Input} from '@angular/core';
import {FormControl, FormArray} from '@angular/forms';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
})
export class QuestionComponent {
  @Input()
  label?: string;

  @Input()
  ctrl?: FormControl | FormArray;

  constructor() {}
}
