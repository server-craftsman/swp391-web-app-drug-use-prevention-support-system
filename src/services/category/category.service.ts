import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type {
  CreateCategoryRequest,
  UpdateCategoryRequest,
  DeleteCategoryRequest,
  CategoryDetailRequest,
  CategoryRequest,
} from "../../types/category/Category.req.type";
import type { Category } from "../../types/category/Category.res.type";

export const CategoryService = {
  getAllCategories(params: CategoryRequest) {
    return BaseService.get<ResponseSuccess<Category[]>>({
      url: API_PATH.CATEGORY.GET_ALL_CATEGORIES,
      payload: params,
    });
  },
  createCategory(params: CreateCategoryRequest) {
    return BaseService.post<ResponseSuccess<Category>>({
      url: API_PATH.CATEGORY.CREATE_CATEGORY,
      payload: params,
    });
  },
  updateCategory(params: UpdateCategoryRequest) {
    return BaseService.put<ResponseSuccess<Category>>({
      url: API_PATH.CATEGORY.UPDATE_CATEGORY(params.categoryId),
      payload: params,
    });
  },
  deleteCategory(params: DeleteCategoryRequest) {
    return BaseService.remove<ResponseSuccess<void>>({
      url: API_PATH.CATEGORY.DELETE_CATEGORY(params.categoryId),
      payload: params,
    });
  },
  getCategoryById(param: CategoryDetailRequest) {
    return BaseService.get<ResponseSuccess<Category>>({
      url: API_PATH.CATEGORY.GET_CATEGORY_BY_ID(param.categoryId),
      payload: param,
    });
  },
};
