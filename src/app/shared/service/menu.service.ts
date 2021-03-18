import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class MenuService {
    visible$ = new BehaviorSubject<boolean>(true);
    scrollTo$ = new BehaviorSubject<number>(0);

    constructor() {}
}
