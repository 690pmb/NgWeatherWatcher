import {Component, OnInit, Type} from '@angular/core';
import {DateTime} from 'luxon';
import {SliderComponent} from '../slider/slider.component';
import {MultipleData} from '../../model/multiple-data';
import {TranslateService} from '@ngx-translate/core';
import {AlertService} from '../../../../service/alert.service';
import {CreateAlert} from '../../../../model/alert/create-alert';
import {AuthService} from '../../../../service/auth.service';
import {CreateMonitoredField} from '../../../../model/alert/create-monitored-field';
import {SliderFormatter} from '../../model/slider-formatter';
import {Utils} from '../../../../shared/utils';
import {AlertWeatherFieldComponent} from '../alert-weather-field/alert-weather-field.component';
import {FormArray, FormBuilder, FormControl, Validators} from '@angular/forms';
import {ToastService} from '../../../../service/toast.service';
import {Router} from '@angular/router';
import {AlertWeatherField} from '../../model/alert-weather-field';
import {Pip, pipTypeMapping} from '../../model/pip';
import {SliderConfig} from '../../model/slider-config';
import {SliderType} from '../../model/slider-type';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss'],
})
export class AlertComponent implements OnInit {
  initLocation!: string;
  triggerDayChoices!: {key: string; value: string}[];
  monitoredDayChoices = ['same_day', 'next_day', 'two_day_later'];

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
    private router: Router
  ) {}

  ngOnInit(): void {
    const days = Array.from(Array(7).keys());
    this.triggerDayChoices = days.map(i => {
      const day = DateTime.fromFormat(`${i + 1} 8 2022`, 'd M yyyy');
      return {
        key: day.toFormat('EEEE'),
        value: day.toFormat('EEEE', {
          locale: this.translate.currentLang,
        }),
      };
    });
    days.forEach(() =>
      this.addToFormArray('triggerDays', this.fb.control(false))
    );
    this.monitoredDayChoices.forEach(() =>
      this.addToFormArray('monitoredDays', this.fb.control(false))
    );
    this.authService.token$.subscribe(token => {
      this.initLocation = token?.location ?? '';
      this.alertForm.get('location')?.setValue(this.initLocation);
    });
  }

  addToFormArray(name: string, control: FormControl): void {
    (this.alertForm.get(name) as FormArray).push(control);
  }

  onSubmit(): void {
    const formValue = this.alertForm.value;
    const alert: CreateAlert = {
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
    this.alertService.create(alert).subscribe(() => {
      this.toast.success('alert.created');
      this.router.navigateByUrl('alert');
    });
  }
}
