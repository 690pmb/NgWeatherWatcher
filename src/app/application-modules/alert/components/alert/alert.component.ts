import {Component, OnInit, Type} from '@angular/core';
import {DateTime} from 'luxon';
import {SliderComponent} from '../slider/slider.component';
import {MultipleData} from '../../model/multiple-data';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '@services/alert.service';
import {CreateAlert} from '@model/alert/create-alert';
import {AuthService} from '@services/auth.service';
import {CreateMonitoredField} from '@model/alert/create-monitored-field';
import {SliderFormatter} from '../../model/slider-formatter';
import {Utils} from '@shared/utils';
import {AlertWeatherFieldComponent} from '../alert-weather-field/alert-weather-field.component';
import {FormArray, FormBuilder, Validators} from '@angular/forms';
import {ToastService} from '@services/toast.service';
import {Router, ActivatedRoute} from '@angular/router';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {Pip, pipTypeMapping} from '../../model/pip';
import {SliderConfig} from '../../model/slider-config';
import {SliderType} from '../../model/slider-type';
import {of, iif} from 'rxjs';
import {mergeMap, tap, map} from 'rxjs/operators';
import {Alert} from '@model/alert/alert';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
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

  triggerHourConfig: SliderConfig = {
    min: 0,
    max: 1425,
    initialValue: 720,
    step: 15,
    pips: this.hourPip,
    multiple: false,
    formatter: SliderFormatter.hourFormatter,
  };

  monitoredHourConfig: SliderConfig = {
    min: 0,
    max: 1440,
    step: 60,
    pips: this.hourPip,
    multiple: false,
    formatter: SliderFormatter.hourFormatter,
  };

  alertWeatherFieldComponent: Type<
    MultipleData<AlertWeatherField, SliderConfig>
  > = AlertWeatherFieldComponent;

  sliderComponent: Type<MultipleData<SliderType, SliderConfig>> =
    SliderComponent;

  alertForm = this.fb.group({
    triggerDays: this.fb.array<boolean>([], {validators: Utils.arrayValidator}),
    monitoredDays: this.fb.array<boolean>([], {
      validators: Utils.arrayValidator,
    }),
    forceNotification: this.fb.control(false, {nonNullable: true}),
    triggerHour: this.fb.control(0, {nonNullable: true}),
    location: this.fb.control('', Validators.required),
    monitoredHours: this.fb.array<number>([]),
    monitoredFields: this.fb.array<AlertWeatherField>([], Validators.required),
  });

  constructor(
    private translate: TranslateService,
    private fb: FormBuilder,
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
    this.alertForm.get('location')?.setValue(this.initLocation);
    this.initTriggerDays();
    this.initMonitoredDays();
    this.alertForm
      .get('forceNotification')
      ?.setValue(this.existingAlert?.forceNotification ?? false);
    this.initTriggerHour();
    this.existingAlert?.monitoredHours.forEach(m => {
      const split = m.split(':');
      this.addToFormArray(
        'monitoredHours',
        Utils.timeToMinutes(+split[0], +split[1])
      );
    });
    this.existingAlert?.monitoredFields.forEach(f =>
      this.addToFormArray('monitoredFields', {
        min: f.min,
        max: f.max,
        field: {min: f.min, max: f.max, field: f.field},
      } as AlertWeatherField)
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
      this.addToFormArray(
        'triggerDays',
        existingTriggerDays?.includes(d.value.toLowerCase())
      )
    );
  }

  private initMonitoredDays(): void {
    const existingMonitoredDays = this.existingAlert?.getMonitoredDays() ?? [];
    this.monitoredDayChoices = ['same_day', 'next_day', 'two_day_later'].map(
      m => `alert.monitored_days.${m}`
    );
    this.monitoredDayChoices.forEach(m =>
      this.addToFormArray('monitoredDays', existingMonitoredDays.includes(m))
    );
  }

  private initTriggerHour(): void {
    const existingTriggerHour = this.existingAlert?.triggerHour;
    if (existingTriggerHour) {
      this.alertForm
        .get('triggerHour')
        ?.setValue(
          Utils.timeToMinutes(
            existingTriggerHour.hour,
            existingTriggerHour.minute
          )
        );
    }
  }

  addToFormArray<T>(name: string, value: T): void {
    (this.alertForm.get(name) as FormArray).push(this.fb.control(value));
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
            t ? this.triggerDayChoices[i].key.toUpperCase() : undefined
          )
          .filter((t): t is string => !!t) ?? [],
      triggerHour: formValue.triggerHour ?? 0,
      location: formValue.location ?? '',
      monitoredHours:
        formValue.monitoredHours?.filter((t): t is number => !!t) ?? [],
      monitoredFields:
        formValue.monitoredFields
          ?.filter((t): t is AlertWeatherField => !!t)
          .map(
            a =>
              ({
                field: a.field.field,
                min: a.min,
                max: a.max,
              } as CreateMonitoredField)
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
