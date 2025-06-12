export interface BlogRequest {
  pageNumber: number;
  pageSize: number;
  filterByContent?: string; // optional
}
export interface CreateBlogRequest {
  content: string;
  blogImgUrl: string;
}
