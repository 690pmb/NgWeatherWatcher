import {Component, OnInit, TrackByFunction, Type, inject} from '@angular/core';
import {DateTime} from 'luxon';
import {SliderComponent} from '../slider/slider.component';
import {MultipleData} from '../../model/multiple-data';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import {AlertService} from '@services/alert.service';
import {CreateAlert} from '@model/alert/create-alert';
import {AuthService} from '@services/auth.service';
import {CreateMonitoredField} from '@model/alert/create-monitored-field';
import {SliderFormatter} from '../../model/slider-formatter';
import {Utils} from '@shared/utils';
import {AlertWeatherFieldComponent} from '../alert-weather-field/alert-weather-field.component';
import { FormArray, FormControl, FormGroup, NonNullableFormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {ToastService} from '@services/toast.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {Pip, pipTypeMapping} from '../../model/pip';
import {SliderConfig, Value} from '../../model/slider';
import {of, iif} from 'rxjs';
import {mergeMap, tap, map} from 'rxjs/operators';
import {Alert} from '@model/alert/alert';
import {MonitoredDay} from '@model/alert/monitored-days';
import {MonitoredField} from '@model/alert/monitored-field';
import { MatButtonModule } from '@angular/material/button';
import { MultipleComponent } from '../multiple/multiple.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { SearchLocationComponent } from '../../../../shared/component/search-location/search-location.component';
import { QuestionComponent } from '../question/question.component';
import { NgIf, NgFor, TitleCasePipe } from '@angular/common';

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
        NgIf,
        FormsModule,
        ReactiveFormsModule,
        QuestionComponent,
        SearchLocationComponent,
        NgFor,
        MatCheckboxModule,
        SliderComponent,
        MultipleComponent,
        MatButtonModule,
        TitleCasePipe,
        TranslateModule,
    ],
})
export class AlertComponent implements OnInit {
  private fb = inject(NonNullableFormBuilder);
  initLocation!: string;
  existingAlert?: Alert;
  triggerDayChoices!: {key: string; value: string}[];
  monitoredDayChoices!: string[];
  ready = false;

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
    SliderComponent;

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

  constructor(
    private translate: TranslateService,
    private alertService: AlertService,
    protected authService: AuthService,
    private toast: ToastService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    of(this.activatedRoute.snapshot.paramMap.get('id'))
      .pipe(
        mergeMap(id =>
          iif(
            () => Utils.isNotBlank(id),
            this.alertService.getById(id ?? '').pipe(
              tap(a => (this.existingAlert = a)),
              map(a => a.location)
            ),
            this.authService.token$.pipe(map(t => t?.location))
          )
        )
      )
      .subscribe(location => this.initFormValue(location));
  }

  private initFormValue(location?: string): void {
    this.ready = true;
    this.initLocation = location ?? '';
    this.alertForm.controls.location?.setValue(this.initLocation);
    this.initTriggerDays();
    this.initMonitoredDays();
    this.alertForm.controls.forceNotification?.setValue(
      this.existingAlert?.forceNotification ?? false
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
      })
    );
  }

  private initTriggerDays(): void {
    const existingTriggerDays = this.existingAlert?.getTriggerDays(
      this.translate.currentLang,
      false
    );
    this.triggerDayChoices = Array.from(Array(7).keys()).map(i => {
      const day = DateTime.fromFormat(`${i + 1} 8 2022`, 'd M yyyy');
      return {
        key: day.toFormat('EEEE'),
        value: day.toFormat('EEEE', {
          locale: this.translate.currentLang,
        }),
      };
    });
    this.triggerDayChoices.forEach(d =>
      this.addToFormArray({
        name: 'triggerDays',
        value: existingTriggerDays?.includes(d.value.toLowerCase()) ?? false,
      })
    );
  }

  private initMonitoredDays(): void {
    const existingMonitoredDays = this.existingAlert?.getMonitoredDays() ?? [];
    this.monitoredDayChoices = Object.values(MonitoredDay).map(
      m => `alert.monitored_days.${m}`
    );
    this.monitoredDayChoices.forEach(m =>
      this.addToFormArray({
        name: 'monitoredDays',
        value: existingMonitoredDays.includes(m),
      })
    );
  }

  private initTriggerHour(): void {
    const existingTriggerHour = this.existingAlert?.triggerHour;
    if (existingTriggerHour) {
      this.alertForm.controls.triggerHour?.setValue(
        Utils.timeToMinutes(
          existingTriggerHour.hour,
          existingTriggerHour.minute
        )
      );
    }
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
      this.fb.control(ctrl.value)
    );
  }

  onSubmit(): void {
    const formValue = this.alertForm.value;
    const alert: CreateAlert = {
      id: this.existingAlert?.id,
      monitoredDays: {
        sameDay: formValue?.monitoredDays?.[0] ?? false,
        nextDay: formValue?.monitoredDays?.[1] ?? false,
        twoDayLater: formValue?.monitoredDays?.[2] ?? false,
      },
      triggerDays:
        formValue.triggerDays
          ?.map((t, i) =>
            t ? this.triggerDayChoices[i]?.key.toUpperCase() : undefined
          )
          .filter((t): t is string => !!t) ?? [],
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
              }) as CreateMonitoredField
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

  trackByFn1: TrackByFunction<{key: string; value: string}> = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
    item: {key: string; value: string}
  ) => item.key;

  trackByFn2: TrackByFunction<MonitoredField> = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
    item: MonitoredField
  ) => item.field;
}
