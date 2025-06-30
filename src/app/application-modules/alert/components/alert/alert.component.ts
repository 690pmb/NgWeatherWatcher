import {Component, OnDestroy, OnInit, Type, inject} from '@angular/core';
import {DateTime} from 'luxon';
import {SliderComponent} from '../slider/slider.component';
import {MultipleData} from '../../model/multiple-data';
import {TranslatePipe} from '@ngx-translate/core';
import {AlertService} from '@services/alert.service';
import {CreateAlert} from '@model/alert/create-alert';
import {AuthService} from '@services/auth.service';
import {CreateMonitoredField} from '@model/alert/create-monitored-field';
import {SliderFormatter} from '../../model/slider-formatter';
import {Utils} from '@shared/utils';
import {AlertWeatherFieldComponent} from '../alert-weather-field/alert-weather-field.component';
import {
  FormArray,
  FormControl,
  FormGroup,
  NonNullableFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import {ToastService} from '@services/toast.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {Pip, pipTypeMapping} from '../../model/pip';
import {SliderConfig, Value} from '../../model/slider';
import {of, iif, combineLatest, Subscription} from 'rxjs';
import {mergeMap, tap, map, switchMap} from 'rxjs/operators';
import {Alert} from '@model/alert/alert';
import {MatButtonModule} from '@angular/material/button';
import {MultipleComponent} from '../multiple/multiple.component';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {SearchLocationComponent} from '@shared/component/search-location/search-location.component';
import {QuestionComponent} from '../question/question.component';
import {TitleCasePipe} from '@angular/common';
import {MatTooltip} from '@angular/material/tooltip';
import {faCircleQuestion} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {DropDownChoice} from '@model/dropdown-choice';
import {LangService} from '@services/lang.service';

type AlertForm = {
  triggerDays: FormArray<FormControl<boolean>>;
  monitoredDays: FormArray<FormControl<boolean>>;
  forceNotification: FormControl<boolean>;
  triggerHour: FormControl<number>;
  location: FormControl<string>;
  monitoredHours: FormArray<FormControl<Value<false, number>>>;
  monitoredFields: FormArray<FormControl<AlertWeatherField>>;
};

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    QuestionComponent,
    SearchLocationComponent,
    MatCheckboxModule,
    SliderComponent,
    MultipleComponent,
    MatButtonModule,
    FontAwesomeModule,
    TitleCasePipe,
    MatTooltip,
    TranslatePipe,
  ],
})
export class AlertComponent implements OnInit, OnDestroy {
  private fb = inject(NonNullableFormBuilder);
  initLocation!: string;
  existingAlert?: Alert;
  triggerDayChoices!: DropDownChoice<string>[];
  monitoredDayChoices!: DropDownChoice<string>[];
  ready = false;
  faCircleQuestion = faCircleQuestion;

  hourPip: Pip = {
    mode: 'steps',
    density: 4,
    filter: value =>
      pipTypeMapping[
        value % 180 === 0 ? 'BIG' : value % 60 === 0 ? 'NO_VALUE' : 'NONE'
      ],
    format: SliderFormatter.hourFormatter,
  };

  triggerHourConfig: SliderConfig<false> = {
    min: 0,
    max: 1425,
    value: 720,
    step: 15,
    pips: this.hourPip,
    multiple: false,
    formatter: SliderFormatter.hourFormatter,
  };

  monitoredHourConfig: SliderConfig<false> = {
    min: 0,
    max: 1440,
    step: 60,
    pips: this.hourPip,
    multiple: false,
    formatter: SliderFormatter.hourFormatter,
  };

  alertWeatherFieldComponent: Type<MultipleData<AlertWeatherField, boolean>> =
    AlertWeatherFieldComponent;

  sliderComponent: Type<MultipleData<Value<false, number>, false>> =
    SliderComponent<false>;

  alertForm: FormGroup<AlertForm> = this.fb.group({
    triggerDays: this.fb.array<boolean>([], {validators: Utils.arrayValidator}),
    monitoredDays: this.fb.array<boolean>([], {
      validators: Utils.arrayValidator,
    }),
    forceNotification: this.fb.control(false),
    triggerHour: this.fb.control(0),
    location: this.fb.control('', Validators.required),
    monitoredHours: this.fb.array<Value<false, number>>([]),
    monitoredFields: this.fb.array<AlertWeatherField>([], Validators.required),
  });

  sub: Subscription[] = [];

  constructor(
    private alertService: AlertService,
    protected authService: AuthService,
    protected langService: LangService,
    private toast: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sub.push(
      combineLatest([
        of(this.activatedRoute.snapshot.paramMap.get('id')),
        this.authService.token$,
        this.langService.getLang(),
      ])
        .pipe(
          mergeMap(([id, token, lang]) =>
            iif(
              () => Utils.isNotBlank(id),
              this.alertService.getById(id!).pipe(
                tap(a => (this.existingAlert = a)),
                map(a => a.location),
              ),
              of(token?.location),
            ).pipe(
              map(location => ({
                location,
                lang,
              })),
            ),
          ),
          tap(data => this.initFormValue(data.location ?? '', data.lang)),
          switchMap(() => this.alertForm.controls.triggerDays.valueChanges),
        )
        .subscribe(triggerDays => {
          this.setMonitorDaysStatus(triggerDays);
        }),
    );
  }

  private initFormValue(location: string, lang: string): void {
    this.ready = true;
    this.initLocation = location;
    this.alertForm.controls.location?.setValue(this.initLocation);
    this.triggerDayChoices = this.initDays(
      'triggerDays',
      lang,
      this.existingAlert?.getTriggerDays(lang, false),
    );
    this.monitoredDayChoices = this.initDays(
      'monitoredDays',
      lang,
      this.existingAlert?.getMonitoredDays(lang, false),
    );
    this.setMonitorDaysStatus(this.alertForm.controls.triggerDays.value);
    this.alertForm.controls.forceNotification?.setValue(
      this.existingAlert?.forceNotification ?? false,
    );
    this.initTriggerHour();
    this.existingAlert?.monitoredHours.forEach(m => {
      const split = m.split(':');
      this.addToFormArray({
        name: 'monitoredHours',
        value: {
          value: Utils.timeToMinutes(+(split[0] ?? '0'), +(split[1] ?? '0')),
          multiple: false,
        },
      });
    });
    this.existingAlert?.monitoredFields.forEach(f =>
      this.addToFormArray({
        name: 'monitoredFields',
        value: {
          min: f.min,
          max: f.max,
          field: {min: f.min, max: f.max, field: f.field},
        } as AlertWeatherField,
      }),
    );
  }

  private initDays(
    name: 'monitoredDays' | 'triggerDays',
    lang: string,
    existing?: string[],
  ): DropDownChoice<string>[] {
    const choices = Array.from(Array(7).keys()).map(i => {
      const day = DateTime.fromFormat(`${i + 1} 8 2022`, 'd M yyyy');
      return {
        key: day.toFormat('EEEE'),
        value: day.toFormat('EEEE', {
          locale: lang,
        }),
      };
    });
    choices.forEach(d =>
      this.addToFormArray({
        name: name,
        value: existing?.includes(d.value) ?? false,
      }),
    );
    return choices;
  }

  private initTriggerHour(): void {
    const existingTriggerHour = this.existingAlert?.triggerHour;
    if (existingTriggerHour) {
      this.alertForm.controls.triggerHour?.setValue(
        Utils.timeToMinutes(
          existingTriggerHour.hour,
          existingTriggerHour.minute,
        ),
      );
    }
  }

  private setMonitorDaysStatus(triggerDays: boolean[]): void {
    let idx = Array.from(Array(7).keys())
      .filter(i => triggerDays[i])
      .flatMap(i => Array.from(Array(3).keys()).map(k => (i + k) % 7));
    idx = [...new Set(idx)];
    Array.from(Array(7).keys()).forEach(i => {
      const monitoredDays = this.alertForm.controls.monitoredDays.at(i);
      if (idx.includes(i)) {
        monitoredDays.enable();
      } else {
        monitoredDays.disable();
        monitoredDays.setValue(false);
      }
    });
  }

  addToFormArray<
    U extends {
      [K in keyof AlertForm]: AlertForm[K] extends FormArray<
        FormControl<infer O>
      >
        ? {name: K; value: O}
        : never;
    }[keyof AlertForm],
  >(ctrl: U): void {
    (this.alertForm.controls[ctrl.name] as FormArray).push(
      this.fb.control(ctrl.value),
    );
  }

  private mapFormDays(
    choices: DropDownChoice<string>[],
    days?: boolean[],
  ): string[] {
    return (
      days
        ?.map((t, i) => (t ? choices[i]?.key.toUpperCase() : undefined))
        .filter((t): t is string => !!t) ?? []
    );
  }

  ngOnDestroy(): void {
    this.sub.forEach(s => s.unsubscribe());
  }

  onSubmit(): void {
    const formValue = this.alertForm.value;
    const alert: CreateAlert = {
      id: this.existingAlert?.id,
      monitoredDays: this.mapFormDays(
        this.monitoredDayChoices,
        this.alertForm.controls.monitoredDays.getRawValue(),
      ),
      triggerDays: this.mapFormDays(
        this.triggerDayChoices,
        formValue.triggerDays,
      ),
      triggerHour: formValue.triggerHour ?? 0,
      location: formValue.location ?? '',
      monitoredHours:
        formValue.monitoredHours
          ?.map(v => v.value)
          .filter((t): t is number => !!t) ?? [],
      monitoredFields:
        formValue.monitoredFields
          ?.filter((t): t is AlertWeatherField => !!t)
          .map(
            a =>
              ({
                field: a.field.field,
                min: a.min,
                max: a.max,
              }) as CreateMonitoredField,
          ) ?? [],
      forceNotification: formValue.forceNotification ?? false,
    };
    if (this.existingAlert?.id) {
      this.alertService.update(alert).subscribe(() => {
        this.toast.success('alert.updated');
        this.router.navigateByUrl('alert');
      });
    } else {
      this.alertService.create(alert).subscribe(() => {
        this.toast.success('alert.created');
        this.router.navigateByUrl('alert');
      });
    }
  }
}
