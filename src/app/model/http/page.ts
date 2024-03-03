export type Page<T> = {
  content: T[];
  totalElements: number;
  number: number;
  size: number;
};
