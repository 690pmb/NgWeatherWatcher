import {
  MatColumnDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
  MatTableModule,
} from '@angular/material/table';
import {
  AfterContentInit,
  Component,
  ContentChildren,
  Input,
  QueryList,
  ViewChild,
  ElementRef,
  HostBinding,
  AfterViewChecked,
} from '@angular/core';
import {KeyValuePipe, NgTemplateOutlet} from '@angular/common';
import {Template} from '@model/template';
import {TranslatePipe} from '@ngx-translate/core';

export type Config<T> = {
  template?: Template<{i18n: string; value: string; item?: T}>;
  additionalTemplate?: Template<Record<'item', T>>;
  formatFields?: Record<string, (a: T) => string>;
  empty?: string;
  color?: string;
};

@Component({
  standalone: true,
  imports: [KeyValuePipe, NgTemplateOutlet, MatTableModule, TranslatePipe],
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

  @Input({required: true})
  dataSource!: T[];

  @Input()
  config?: Config<T>;

  expanded?: T;

  constructor(private el: ElementRef) {}

  ngAfterContentInit(): void {
    this.color = `var(--${this.config?.color})`;
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef =>
      this.table.addHeaderRowDef(headerRowDef),
    );
  }

  ngAfterViewChecked(): void {
    if (!this.expandHeight) {
      const height =
        (this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(
          '.mat-column-details:not(.hide)',
        )?.offsetHeight ?? 0;
      if (height) {
        setTimeout(() => (this.expandHeight = `${height - 2}px`));
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
        ((this.el.nativeElement as HTMLElement).querySelector<HTMLElement>(
          '.mat-mdc-row:not(.detail-row)',
        )?.offsetHeight ?? 0) + 2
      }px`;
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  unsorted(_a: any, _b: any): number {
    return 0;
  }
}
