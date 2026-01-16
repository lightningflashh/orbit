// Interface cho phần phân trang
export interface PaginationMeta {
  page: number;
  pageSize: number;
  pages: number;
  total: number;
}

// Interface dùng chung cho mọi API Response
export interface ApiResponse<T> {
  data: {
    meta: PaginationMeta;
    result: T[];
  };
  message: string;
  success: boolean;
  timestamp: string;
}