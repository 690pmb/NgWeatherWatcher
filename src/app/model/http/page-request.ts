import {sortToUrl, SortField} from '../sort';
import {SortDirection} from '@angular/material/sort';

export class PageRequest<T> {
  size = 0;
  page = 10;
  sortField?: SortField<T>;
  sortDir: SortDirection = '';

  toUrl(): string {
    return `?page=${this.page}&size=${this.size}&${sortToUrl<T>(
      this.sortField,
      this.sortDir,
    )}`;
  }
}
