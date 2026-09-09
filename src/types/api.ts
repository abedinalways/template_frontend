export interface IApiResponse<T = unknown> {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: IPaginationMeta;
}

export interface IPaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPage: number;
}

export interface IApiError {
  statusCode: number;
  message: string;
  errorSources?: Array<{
    path: string | number;
    message: string;
  }>;
}
