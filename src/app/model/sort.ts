import {SortDirection} from '@angular/material/sort';

export type SortField<T> = `${string & keyof T}`;

export const sortToUrl = <T>(
  sorting?: SortField<T>,
  dir?: SortDirection,
): string => (sorting && dir ? `sort=${sorting},${dir}` : '');
