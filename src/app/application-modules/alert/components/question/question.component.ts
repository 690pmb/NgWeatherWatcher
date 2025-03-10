import {Component, Input} from '@angular/core';
import {FormControl, FormArray} from '@angular/forms';
import {TranslatePipe} from '@ngx-translate/core';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  standalone: true,
  imports: [MatDividerModule, TranslatePipe],
})
export class QuestionComponent<T> {
  @Input()
  label?: string;

  @Input()
  ctrl?: FormArray | FormControl<T>;
}
