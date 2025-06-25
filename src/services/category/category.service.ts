import { BaseService } from "../../app/api/base.service";
import type { ResponseSuccess } from "../../app/interface";
import { API_PATH } from "../../consts/api.path.const";
import type { CreateCategoryRequest } from "../../types/category/Category.req.type";
import type { Category } from "../../types/category/Category.res.type";

export const CategoryService = {
  getAllCategories() {
    return BaseService.get<ResponseSuccess<Category[]>>({
      url: API_PATH.CATEGORY.GET_ALL_CATEGORIES,
    });
  },
  createCategory(params: CreateCategoryRequest) {
    return BaseService.post<ResponseSuccess<Category>>({
      url: API_PATH.CATEGORY.CREATE_CATEGORY,
      payload: params,
    });
  },
};
