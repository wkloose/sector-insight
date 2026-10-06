export enum StatusType {
  STABLE = "STABLE",
  WARNING = "WARNING",
  CRITICAL = "CRITICAL",
}

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
  error?: string
}

export interface Pagination {
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
}

export interface PaginatedResponse<T> {
  items: T[]
  pagination: Pagination
}

