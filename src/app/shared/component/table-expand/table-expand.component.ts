import {
  MatColumnDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
} from '@angular/material/table';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewChild,
  TemplateRef,
  ElementRef,
  HostBinding,
  AfterViewChecked,
  TrackByFunction,
} from '@angular/core';
import {KeyValue} from '@angular/common';

export type Config<T> = {
  template?: TemplateRef<Record<'i18n' | 'value', string>>;
  additionalTemplate?: TemplateRef<Record<'item', T>>;
  formatFields?: Record<string, (a: T) => string>;
  empty?: string;
  color?: string;
};

@Component({
  selector: 'app-table-expand',
  templateUrl: './table-expand.component.html',
  styleUrls: ['./table-expand.component.scss'],
})
export class TableExpandComponent<T>
  implements AfterContentInit, AfterViewChecked
{
  @HostBinding('style.--row-height')
  protected rowHeight!: string;

  @HostBinding('style.--expand-height')
  protected expandHeight?: string;

  @HostBinding('style.--color')
  protected color?: string;

  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  @ViewChild(MatTable, {static: true}) table!: MatTable<T>;

  @Input()
  dataSource!: T[];

  @Input()
  config?: Config<T>;

  expanded?: T;

  constructor(private el: ElementRef) {}

  ngAfterViewChecked(): void {
    if (!this.expandHeight) {
      const height =
        (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(
          '.mat-column-details:not(.hide)'
        )?.offsetHeight ?? 0;
      if (height) {
        setTimeout(() => (this.expandHeight = `${height}px`));
      }
    }
  }

  expand(item: T): void {
    if (this.expanded !== item) {
      this.expandHeight = undefined;
    }
    this.expanded = this.expanded === item ? undefined : item;
    if (this.expanded) {
      this.rowHeight = `${
        (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(
          '.mat-mdc-row:not(.detail-row)'
        )?.offsetHeight ?? 0
      }px`;
    }
  }

  ngAfterContentInit(): void {
    this.color = `var(--${this.config?.color})`;
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef =>
      this.table.addHeaderRowDef(headerRowDef)
    );
  }

  trackByFn: TrackByFunction<KeyValue<string, (a: T) => string>> = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _index: number,
    item: KeyValue<string, (a: T) => string>
  ) => item.key;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  unsorted(_a: any, _b: any): number {
    return 0;
  }
}
