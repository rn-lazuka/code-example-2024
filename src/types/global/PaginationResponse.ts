type Sort = {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
};

export type Pageable = {
  offset: number;
  sort: Sort;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
};

export type PaginationResponse = {
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
  sort: Sort;
  pageable: Pageable;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
};
