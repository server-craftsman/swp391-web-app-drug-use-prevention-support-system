export interface BlogRequest {
  pageNumber: number;
  pageSize: number;
  filterByContent?: string; // optional
}
