import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  static readonly bearer = 'Bearer ';

  constructor(
    protected httpClient: HttpClient,
    protected toast: ToastService
  ) { }

  static encodeQueryUrl(query: string): string {
    return encodeURIComponent(query).replace(/[!'()*]/g, (c) => '%' + c.charCodeAt(0).toString(16));
  }

  static getErrorMessage(error: any): string {
    let message;
    if (error.response) {
      message = error.response.error;
    } else if (error.error && error.error.errors) {
      message = 'Status ' + error.status + ': ' + error.error.errors.join(', ');
    } else if (error.error) {
      message = error.error;
    } else if (error.message) {
      message = error.message;
    } else {
      message = 'Unknown Error';
    }
    return message;
  }

  getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: UtilsService.bearer + localStorage.getItem('token')
    });
  }

  handleError(error: any): void {
    console.error('handleError', error);
    this.toast.error(UtilsService.getErrorMessage(error));
  }
}
