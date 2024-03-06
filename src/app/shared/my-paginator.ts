import {DecimalPipe} from '@angular/common';
import {MatLegacyPaginatorIntl as MatPaginatorIntl} from '@angular/material/legacy-paginator';
import {TranslateService} from '@ngx-translate/core';

export class MyPaginator extends MatPaginatorIntl {
  constructor(
    private translate: TranslateService,
    public prefix: string = 'global'
  ) {
    super();
    this.translate.onLangChange.subscribe(() => {
      this.initTranslation();
    });
    this.initTranslation();
  }

  initTranslation(): void {
    this.itemsPerPageLabel = this.translate.instant(
      `${this.prefix}.mat-table.itemsPerPageLabel`
    ) as string;
    this.nextPageLabel = this.translate.instant(
      'global.mat-table.nextPageLabel'
    ) as string;
    this.previousPageLabel = this.translate.instant(
      'global.mat-table.previousPageLabel'
    ) as string;
    this.lastPageLabel = this.translate.instant(
      'global.mat-table.lastPageLabel'
    ) as string;
    this.firstPageLabel = this.translate.instant(
      'global.mat-table.firstPageLabel'
    ) as string;
  }

  override getRangeLabel = (
    page: number,
    pageSize: number,
    length: number
  ): string => {
    if (length === 0 || pageSize === 0) {
      return this.translate.instant('global.mat-table.no_result') as string;
    }
    const size = Math.max(length, 0);
    const startIndex = page * pageSize;
    // If the start index exceeds the list length, do not try and fix the end index to the end.
    const endIndex =
      startIndex < size
        ? Math.min(startIndex + pageSize, size)
        : startIndex + pageSize;
    const decimalPipe = new DecimalPipe(this.translate.currentLang);
    return `${startIndex + 1} - ${endIndex} ${
      this.translate.instant('global.mat-table.of') as string
    } 
        ${decimalPipe.transform(size, '1.0', this.translate.currentLang)}`;
  };
}
