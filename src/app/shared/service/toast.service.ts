import {Injectable} from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import {TranslateService} from '@ngx-translate/core';
import {Utils} from '../utils';
import {Level} from './../../model/level';

@Injectable()
export class ToastService {
  constructor(
    public snackBar: MatSnackBar,
    private translate: TranslateService
  ) {}

  open(level: Level, message: string, translateArgs?: string): void {
    if (Utils.isNotBlank(message)) {
      this.snackBar.open(
        this.translate.instant(message, translateArgs),
        undefined,
        {
          duration: 3000,
          panelClass: `toast-${level}`,
        }
      );
    }
  }

  error(message: string, translateArgs?: string): void {
    this.open(Level.error, message, translateArgs);
  }

  warning(message: string, translateArgs?: string): void {
    this.open(Level.warning, message, translateArgs);
  }

  info(message: string, translateArgs?: string): void {
    this.open(Level.info, message, translateArgs);
  }

  success(message: string, translateArgs?: string): void {
    this.open(Level.success, message, translateArgs);
  }
}
