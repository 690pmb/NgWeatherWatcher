import {HttpParams} from '@angular/common/http';
import {PageRequest} from './page-request';

export type HttpRequest = {
  url?: string;
  params?: HttpParams;
};

export type HttpPagedRequest<T> = HttpRequest & {
  pageRequest?: PageRequest<T>;
};

export type HttpBodyRequest = HttpRequest & {
  body?: unknown | null;
};
