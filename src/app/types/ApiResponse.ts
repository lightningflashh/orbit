export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

export interface ApiResponse<T> {
  data: {
    meta: PaginationMeta;
    result: T[];
  };
  message: string;
  success: boolean;
  timestamp: string;
}