import {TemplateRef} from '@angular/core';

export type Template<T> = TemplateRef<Record<'$implicit', T>>;
