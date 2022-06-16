import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  title$ = new BehaviorSubject<string>('');

  constructor() {}
}
