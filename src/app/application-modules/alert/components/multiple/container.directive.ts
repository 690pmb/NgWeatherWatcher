import {Directive, ViewContainerRef} from '@angular/core';

@Directive({
  selector: '[appContainer]',
  standalone: true,
})
export class ContainerDirective {
  constructor(public viewContainerRef: ViewContainerRef) {}
}
