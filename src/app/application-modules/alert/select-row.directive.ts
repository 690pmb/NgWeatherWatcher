import {
  Directive,
  HostListener,
  Output,
  EventEmitter,
  Input,
} from '@angular/core';

type Speed = 'fast' | 'slow';

@Directive({
  selector: '[appSelectRow]',
})
export class SelectRowDirective {
  @Input()
  speed: Speed = 'slow';

  @Output()
  selected: EventEmitter<void> = new EventEmitter<void>();

  @HostListener('mouseover', ['$event']) onMouseEnter(): void {
    this.setTimeoutConst = setTimeout(
      () => {
        this.selected.emit();
      },
      this.speed === 'slow' ? 1000 : 200
    );
  }

  @HostListener('mouseout') onMouseOut(): void {
    clearTimeout(this.setTimeoutConst);
  }

  @HostListener('click') onClick(): void {
    clearTimeout(this.setTimeoutConst);
  }

  setTimeoutConst?: number;

  constructor() {}
}
