import { Directive, HostListener, Input } from '@angular/core';
import { AlertDto } from './service/alert-dto';

@Directive({
    selector: '[appSelectRow]'
})
export class SelectRowDirective {
    setTimeoutConst;
    @Input()
    alert: AlertDto;
    @HostListener('mouseover', ['$event']) onMouseEnter(): void {
        this.setTimeoutConst = setTimeout(() => {
            this.alert.selected = true;
        }, 1400);
    }
    @HostListener('mouseout') onMouseOut(): void {
        clearTimeout(this.setTimeoutConst);
    }
    @HostListener('click') onClick(): void {
        clearTimeout(this.setTimeoutConst);
        this.alert.selected = false;
    }
    constructor() {}
}
