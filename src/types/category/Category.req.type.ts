export interface CreateCategoryRequest {
  name: string;
}
export interface UpdateCategoryRequest {
  categoryId: string;
  name: string;
}
export interface DeleteCategoryRequest {
  categoryId: string;
}
export interface CategoryRequest {
  pageNumber: number;
  pageSize: number;
  filterByName?: string;
}
export interface CategoryDetailRequest {
  categoryId: string;
}
