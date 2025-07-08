export interface BlogRequest {
  pageNumber: number;
  pageSize: number;
  filterByContent?: string; // optional
}
export interface CreateBlogRequest {
  content: string;
  blogImgUrl: string;
}

export interface UpdateBlogRequest {
  id: string;
  content: string;
  blogImgUrl: string;
}
export interface DeleteBlogRequest {
  id: string;
}
export interface GetBlogByIdRequest {
  id: string;
}
