import {Directive, HostListener, EventEmitter, Output} from '@angular/core';

@Directive({
  selector: '[appClickOutside]',
})
export class ClickOutsideDirective {
  @Output()
  outside = new EventEmitter<boolean>();

  @HostListener('click')
  clicked(): void {
    this.inside = true;
  }

  @HostListener('document:click')
  clickedOut(): void {
    if (!this.inside) {
      this.outside.emit(true);
    }
    this.inside = false;
  }

  inside = false;

  constructor() {}
}
