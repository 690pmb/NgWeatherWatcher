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
  Renderer2,
  RendererStyleFlags2,
} from '@angular/core';

export type Config<T> = {
  template?: TemplateRef<unknown>;
  innerTemplate?: TemplateRef<unknown>;
  formatFields?: {[key: string]: (a: T) => string};
  empty?: string;
};

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
})
export class TableComponent<T> implements AfterContentInit {
  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;

  @ViewChild(MatTable, {static: true}) table!: MatTable<T>;

  @Input()
  dataSource!: T[];

  @Input()
  config!: Config<T>;

  expanded?: T;

  constructor(private renderer: Renderer2, private el: ElementRef) {}

  expand(item: T): void {
    this.expanded = this.expanded === item ? undefined : item;
    if (this.expanded) {
      setTimeout(
        () =>
          this.renderer.setStyle(
            document.documentElement,
            '--expand-height',
            `${
              this.el.nativeElement.querySelector(
                '.mat-column-details:not(.hide)'
              ).offsetHeight
            }px`,
            RendererStyleFlags2.DashCase
          ),
        0
      );
    }
  }

  ngAfterContentInit(): void {
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef =>
      this.table.addHeaderRowDef(headerRowDef)
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-explicit-any
  unsorted(_a: any, _b: any): number {
    return 0;
  }
}
